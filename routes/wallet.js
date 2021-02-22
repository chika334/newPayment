// const Wallet = require('../model/Wallet')
// const express = require('express')
// const router = express.Router()
// const auth = require('../middleware/auth')

// router.get('/getWallet', auth, async (req, res) => {
//     const wallet = await Wallet.findById(req.user.walletId)
//     res.json(wallet)
// })

// // Add payment
// router.post('/addFunds', auth, async (req, res) => {
//     const { AmountInt } = req.body
//     if (AmountInt == null) {
//         res.status(404).json({
//             msg: 'Input an amount'
//         })
//         return
//     }

//     await Wallet.findById({ _id: req.user.walletId }, (err, wallets) => {
//         if (err) throw err;
//         return wallets.updateOne({ wallet: wallets.wallet + AmountInt }, (err, success) => {
//             if (err) {
//               return res.json({ error: console.log(err)})
//             } else {
//               res.status(200).json({
//                 msg: `Account Credited`
//               });
//             }
//         })
//     })
// })

// // deduct payment
// router.post('/deductFunds', auth, async (req, res) => {
//     const { AmountInt } = req.body

//     await Wallet.findById({ _id: req.user.walletId }, (err, wallets) => {
//         //if (err) throw err;
//         if(wallets.wallet < AmountInt) {
//             return res.status(400).json({
//                 msg: "Can't complete transaction wallet balance low"
//             });
//         } 

//         return wallets.updateOne({ wallet: wallets.wallet - AmountInt }, (err, success) => {
//             if (err) {
//               return res.json({ error: console.log(err)})
//             } else {
//               res.status(200).json({
//                 msg: `Payment made`
//               });
//             }
//         })
//     })
// })

// module.exports = router;
