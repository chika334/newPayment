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
    const { meterInt, service, select } = req.body
    
    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');
    
    config = {
        headers: {
            'Authorization': `Basic ${base64}`
        }
    }
    
    const body = {
        billersCode: meterInt,
        serviceID: service,
        type: select
    }
    
    axios.post(`${process.env.verifyMeterNumber}`, body, config)
        .then(res => {
            console.log(res.data)
            //const electric = new Electric({
              //  Customer_Name: res.data.content.Customer_Name,
                //Meter_Number: res.data.content.Meter_Number,
          //      Address: res.data.content.Address,
            //    walletId: userId._id
            //})

            //electric.save();
        })
        .catch((error) => {
            if (error.response) {
                return error.response
            } else {
                return error.request
            }
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
