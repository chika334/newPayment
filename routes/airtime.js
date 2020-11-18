const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const Transaction = require('../model/Transaction')
const { v4: uuidv4 } = require('uuid');

router.post('/creditTransaction', (req, res) => {
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
        phone: phone
    }

    axios.post(`${process.env.airtime}`, body, config)
        .then(res => {
            let transac = new Transaction({
                product_name: res.data.product_name,
                transactionId: res.data.transactionId,
                amount: res.data.amount,
                total_amount: res.data.total_amount,
                requestId: res.data.requestId,
                date: res.data.date,
                amount: res.data.amount,
                status: res.data.status,
            })
            
            //console.log(transac)
            console.log(res)
        })
        .catch(err => console.log(err))
})

module.exports = router;
