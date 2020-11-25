const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const Pay = require('../model/PayRequest')
const { v4: uuidv4 } = require('uuid');
const Transaction = require("../model/Transaction")
const Electric = require("../model/Electric")
const Verify = require("../model/Verify")

router.post('/verifyNumber', auth, async (req, res, error) => {
    const { meter, service, select } = req.body
    
    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');
    
    const transactionID = uuidv4();
    
    config = {
        headers: {
            'Authorization': `Basic ${base64}`
        }
    }
    
    const body = {
        billersCode: meter,
        serviceID: service,
        type: select
    }
    
    const userId = await Wallet.findById(req.user.walletId)
    
   /* try {
        const URL = `${process.env.verifyMeterNumber}`
        const response = await axios.post(URL, body, config);
        
        const verify = new Verify({
            Customer_Name: response.data.content.Customer_Name,
            Meter_Number: response.data.content.Meter_Number,
            Address: response.data.content.Address,
            walletId: userId._id,
            transactionID: transactionID
        })
        
        verify.save();
        console.log(verify)
        return;
    } catch(error) {
        console.log(error)
    }*/
    axios.post(process.env.verifyMeterNumber, body, config)
        .then(response => {
            const verify = new Verify({
                Customer_Name: response.data.content.Customer_Name,
                Meter_Number: response.data.content.Meter_Number,
                Address: response.data.content.Address,
                walletId: userId._id,
                transactionID: transactionID
            })
            verify.save();
            if(response.data.WrongBillersCode) {
                return err
            } else {
                res.status(200).json({
                    msg: "success"
                })
            }
        })
        .catch(err => {
            response.json({
                msg: response.content.error
            })
        })
})

router.post('/prepaidMeterPayment', auth, async (req, res) => {
    const { name, AmountInt, meter, service, select, phone } = req.body
    //console.log(req.body)
    
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
            console.log(res.data)
         })   
         .catch(err => console.log(err))
         res.status(200).json({
             msg: 'success'
         })
    })
    
module.exports = router;
