const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const Data = require('../model/Data')

router.post('/DataTransaction', auth, async (req, res) => {
    const { AmountInt, service, phone } = req.body
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
        variation_code,
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
        
   res.status(200).json({
       msg: 'success'
   })
})

module.exports = router;
