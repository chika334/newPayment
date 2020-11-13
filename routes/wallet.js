const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/getWallet', auth, (req, res) => {
    const wallet = Wallet.findById(req.user._id)
    console.log(wallet)
})

module.exports = router;
