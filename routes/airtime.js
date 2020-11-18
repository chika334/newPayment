const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')

router.post('/creditTransaction', (req, res) => {
    const { AmountInt, uuidvar, service, phone } = req.body
    
    const config = {
        headers: {
          Username:  `${process.env.email_login}`,
          Password:  `${process.env.password_login}`
        }
      }

    const body = {
        request_id: uuidvar,
        serviceID: service,
        amount: AmountInt,
        phone: phone
    }

    axios.post(`${process.env.airtime}`, body, config)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err))
})

module.exports = router;
