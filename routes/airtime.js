const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

router.post('/creditTransaction', (req, res) => {
    console.log(req.body)
})

module.exports = router;
