const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const Pay = require('../model/PayRequest')
const { v4: uuidv4 } = require('uuid');
const Transaction = require("../model/Transaction")

router.get('/getPayment', auth, async (req, res) => {
    const credit = await Pay.find({ walletId: req.user.walletId })
    res.status(200).json(credit)
})

router.get('/getTransaction', auth, async (req, res) => {
    const transaction = await Transaction.find({ walletId: req.user.walletId })
    res.status(200).json(transaction)
})

router.post('/creditTransaction', auth, async (req, res) => {
    const { AmountInt, service, phone, name } = req.body
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
        phone: phone
    }
    
    const userId = await Wallet.findById(req.user.walletId)
    console.log(userId)

    axios.post(`${process.env.airtime}`, body, config)
        .then(response => {
            const trans = new Transaction({
                amount: response.data.amount,
                requestId: response.data.requestId,
                product_name: response.data.content.transactions.product_name,
                date: response.data.transaction_date.date,
                total_amount: response.data.content.transactions.total_amount,
                transactionId: response.data.content.transactions.transactionId,
                status: response.data.response_description,
                walletId: userId._id,
            })

            trans.save();
            if(response.data.content.transactionId == response.data.content.transactionId) {
                res.status(200).json({
                    trans,
                    success: true,
                    msg: "success"
                })
                return
            } else {
                throw err
            }
        })
        .catch(err => console.log(err))
})

router.post('/Transaction', auth, async (req, res) => {
    const { trans } = req.body

    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');

    const config = {
        headers: {
          "Authorization": `Basic ${base64}`
        }
      }

    const body = {
        request_id: trans,
    }
    
    const userId = await Wallet.findById(req.user.walletId)
    
    //Wallet.find({ wallet: req. })
    axios.post(`${process.env.specificTrans}`, body, config)
        .then(response => {
            const trans = new Transaction({
                amount: response.data.content.transactions.amount,
                requestId: req.body.trans,
                product_name: response.data.content.transactions.type,
                date: response.data.transaction_date.date,
                total_amount: response.data.content.transactions.total_amount,
                transactionId: response.data.content.transactions.transactionId,
                status: response.data.response_description,
                walletId: userId._id
            })

            trans.save();
            if(response.data.content.transactionId == response.data.content.transactionId) {
                res.status(200).json({
                    trans,
                    success: true,
                    msg: "success"
                })
                return
            } else {
                throw err
            }
        })
        .catch(err => {
            const trans = new Transaction({
                status: response.data.response_description
            })
            trans.save();
            res.status(400).json({
                msg: "Error occured while querying transaction"
            })
        })
})

module.exports = router;
