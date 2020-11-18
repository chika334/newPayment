const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

//router.get('/getWallet', auth, async (req, res) => {
  //  const wallet = await Wallet.findById(req.user.walletId)
    //res.json(wallet)
//})

router.post('/creditTransaction', (req, res) => {
    console.log(req.body)
})

module.exports = router;
