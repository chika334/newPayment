const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const Data = require('../model/Data')
const Transaction = require('../model/Transaction')

router.get('/dataTransaction', auth, async (req, res) => {
    const data = await Data.find({ walletId: req.user.walletId })
    res.status(200).json(data)
})

router.post('/DataTransaction', auth, async (req, res) => {
    const { AmountInt, service, phone, variation } = req.body
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
        amount: AmountInt,
        billersCode: phone,
        variation_code: variation,
        amount: AmountInt,
        phone: phone
    }
    
    const userId = await Wallet.findById(req.user.walletId)

    axios.post(`${process.env.data_API}`, body, config)
        .then(res => {
            const data = new Data({
                amount: res.data.amount,
                requestId: res.data.requestId,
                product_name: res.data.content.transactions.product_name,
                date: res.data.transaction_date.date,
                total_amount: res.data.content.transactions.total_amount,
                transactionId: res.data.content.transactions.transactionId,
                status: res.data.response_description,
                walletId: userId._id,
            })
            data.save();
        })
        .catch(err => console.log(err))
})

router.post('/DataTransaction', auth, async (req, res) => {
    const { AmountInt, service, phone, variation } = req.body
    const requestId = uuidv4();

    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');
    
    const uniqueId = uuidv4();

    const config = {
        headers: {
          "Authorization": `Basic ${base64}`
        }
      }

    const body = {
        request_id: requestId,
        serviceID: service,
        amount: AmountInt,
        billersCode: phone,
        variation_code: variation,
        amount: AmountInt,
        phone: phone
    }
    
    const userId = await Wallet.findById(req.user.walletId)

    axios.post(`${process.env.dataSingle}`, body, config)
        .then(res => {
            const trans = new Transaction({
                amount: response.data.content.transactions.amount,
                requestId: req.body.trans,
                product_name: response.data.content.transactions.type,
                date: response.data.transaction_date.date,
                total_amount: response.data.content.transactions.total_amount,
                transactionId: response.data.content.transactions.transactionId,
                status: response.data.response_description,
                walletId: userId._id,
                uniqueId: uniqueId
            })
            trans.save();
        })
        .catch(err => console.log(err))
})


module.exports = router;
