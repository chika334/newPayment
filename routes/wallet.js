const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.get('/getWallet', auth, async (req, res) => {
    const wallet = await Wallet.findById(req.user.walletId)
    res.json(wallet)
})

router.post('/addFunds', auth, async (req, res) => {
    const { AmountInt } = req.body
    if (AmountInt == null) {
        res.status(404).json({
            msg: 'Input an amount'
        })
        return
    }

    let wallet = await Wallet.findById(req.user.walletId)
    //console.log(wallet.wallet)
    let sum = wallet.wallet + AmountInt
    //console.log(sum)
    sum.save()
})

module.exports = router;
