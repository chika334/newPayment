const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/getWallet', auth, async (req, res) => {
    const wallet = await Wallet.findById(req.user._id)
    res.json(wallet)
})

router.post('/addFunds', (req, res) => {
    const { valueamount } = req.body
    console.log(req.body.valueamount)
})

module.exports = router;
