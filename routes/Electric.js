const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const Pay = require('../model/PayRequest')
const { v4: uuidv4 } = require('uuid');
const Transaction = require("../model/Transaction")
const Electric = require("../model/Electric")

router.post('/verifyNumber', auth, async (req, res, error) => {
    const { meter, service, select } = req.body
    
    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');
    
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
    
    axios.post(`${process.env.verifyMeterNumber}`, body, config)
        .then(res => {
            //console.log(res.data)
            const electric = new Electric({
                Customer_Name: res.data.content.transactions.amount,
                Meter_Number: req.body.trans,
                Address: res.data.content.transactions.type,
                walletId: userId._id
            })

            electric.save();
            //console.log(res.data)
        })
        .catch((error) => {
            if (error.response) {
                return error.response
            } else {
                return error.request
            }
        })
    
    if(error) {
        res.status(400).send({
            msg: 'Incorrect meter number. Please try with a correct one'
        })
    } else {
        res.status(200).json({
           msg: 'success'
       })
    }
})

router.post('/prepaidMeterPayment', auth, async (req, res) => {
    const { meter, service, select } = req.body
    console.log(req.body)
})

module.exports = router;
