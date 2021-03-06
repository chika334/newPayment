const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const TvSub = require("../model/payTvSub")
const Smartcard = require("../model/smartCard")

router.get('/getverifySmartcardNumber', auth, async (req, res) => {
    const smartCards = await Smartcard.find({ walletId: req.user.walletId })
    res.json(smartCards)
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
            const smartCards = new Smartcard({
                Customer_Name: response.data.content.Customer_Name,
                Smartcard_Number: smartCard,
                Customer_ID: response.data.content.Customer_ID,
                transactionID: req.body.transactionId,
                walletId: userId._id,
                select: select
            })
            smartCards.save();
            if(response.data.content.Customer_Name == response.data.content.Customer_Name) {
                res.status(200).json({
                    smartCards,
                    success: true,
                    msg: "success"
                })
                return
            } else {
                throw err
            }
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                msg: "Invalid Smartcard Number. Please check and Try Again"
            })
        })
})

router.post('/payTvBill', auth, async (req, res, err) => {
    const { name, AmountInt, smartCard, service, select, phone } = req.body
    
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
        billerCode: smartCard,
        variation_code: select,
        amount: AmountInt,
        phone: phone
    }
    
    const userId = await Wallet.findById(req.user.walletId)

    if(userId.wallet < AmountInt) {
        res.status(400).json({
            msg: "Error occured while querying transaction"
        })
        return
    } else {
        axios.post(`${process.env.PAYTVBILL}`, body, config)
            .then(response => {
                //console.log(res.data)
                const transaction = new Transaction({
                    smartCard: smartCard, 
                    walletId: userId._id, 
                    type: response.data.content.type, 
                    date: response.data.transaction_date.date, 
                    response_description: response.data.response_description, 
                    amount: AmountInt, 
                    product_name: response.data.content.product_name 
                })
                transaction.save();
                if (response.data.response_description === "BELOW MINIMUM AMOUNT ALLOWED") {
                    throw err
                } else {
                    res.status(200).json({
                        transaction,
                        success: true,
                        msg: 'success'
                    })
                }
             })
             .catch(err => {
                //console.log(err)
                res.status(400).json({
                    msg: "Below minimum amount allowed"
                })
             })
        }
  })
    
module.exports = router;
