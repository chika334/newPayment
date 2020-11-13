const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/getWallet', auth, (req, res) => {
    console.log("good")
})
