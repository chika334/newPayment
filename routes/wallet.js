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
    }5faeba5a89ddb30017f15d1d

    let wallets = await Wallet.findById(req.user.walletId)
    wallets = wallets.wallet + AmountInt
    //console.log(dbWallet)
    //wallets = new Wallet({ wallet })
    //console.log(sum)
    await wallets.save()
})

module.exports = router;
