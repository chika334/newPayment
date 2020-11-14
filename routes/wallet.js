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

    let wallets = await Wallet.findById({ _id: req.user.walletId }, (err, result) => {
        console.log(result)
    })
    // console.log(wallets)
    //if(wallets._id) {
        //console.log(wallets.wallet + AmountInt)
       // wallets = new Wallet({ wallet: wallets.wallet + AmountInt })
      //  wallets.save()
   // } else {
   //     console.log("bad")
    //}
})

module.exports = router;
