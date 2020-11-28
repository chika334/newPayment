const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
//const Electric = require("../model/Electric")
const Smartcard = require("../model/smartCard")

router.get('/verifyNumber', auth, async (req, res) => {
    const verify = await Verify.find({ walletId: req.user.walletId })
    res.json(verify)
})

router.post('/verifySmartcardNumber', auth, async (req, res, err) => {
    //console.log(req.body)
    const { service, smartCard, transactionId, select } = req.body
    
    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');
    
    config = {
        headers: {
            'Authorization': `Basic ${base64}`
        }
    }
    
    const body = {
        billersCode: smartCard,
        serviceID: service
    }
    
    const userId = await Wallet.findById(req.user.walletId)
    
    axios.post(process.env.verifyMeterNumber, body, config)
        .then(response => {
            const smartCard = new Smartcard({
                Customer_Name: response.data.content.Customer_Name,
                Meter_Number: response.data.content.Meter_Number,
                Address: response.data.content.Address,
                transactionID: req.body.transactionId,
                walletId: userId._id,
                select: select
            })
            smartCard.save();
            if(response.data.content.WrongBillersCode == false) {
                res.status(200).json({
                    smartCard,
                    success: true,
                    msg: "success"
                })
                return
            } else {
                throw err
            }
        })
        .catch(err => {
            console.log(err)
            /*res.status(400).json({
                success: false,
                msg: "Incorrect meter number. Please try with a correct one"
            })*/
        })
})

router.post('/prepaidMeterPayment', auth, async (req, res) => {
    const { name, AmountInt, meter, service, select, phone } = req.body
    
    const requestId = uuidv4();

    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');

    const config = {
        headers: {
          "Authorization": `Basic ${base64}`
        }
      }

    const body = {
        request_id: requestId,
        serviceID: service,
        billerCode: meter,
        variation_code: select,
        amount: AmountInt,
        phone: phone
    }
    
    const userId = await Wallet.findById(req.user.walletId)

    axios.post(`${process.env.prepaidMeterPayment}`, body, config)
        .then(res => {
            console.log(res.data)
            const electric = new Electric({
                Customer_Name: res.data.content.Customer_Name, 
                Meter_Number: meter, 
                Address: res.data.content.Address, 
                walletId: userId._id, 
                type: res.data.content.type, 
                date: res.data.transaction_date.date, 
                response_description: res.data.response_description, 
                amount: AmountInt, 
                product_name: res.data.content.product_name 
            })
            electric.save();
            if (res.data.response_description === "BELOW MINIMUM AMOUNT ALLOWED") {
                throw err
            } else {
                res.status(200).json({
                     msg: 'success'
                })
            }
         })
         .catch(err => {
            res.status(400).json({
                msg: "Below minimum amount allowed"
            })
         })
    })
    
module.exports = router;
