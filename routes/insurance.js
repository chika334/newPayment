/*const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const Pay = require('../model/PayRequest')
const { v4: uuidv4 } = require('uuid');
const Transaction = require("../model/Transaction")

router.post('/insurance', auth, async (req, res) => {
    // console.log(req.body)
    const { service, amount, phone, variation, name, plateNumber, engineNumber, chasisNumber, vehicleMake, vehicleColor, vehicleModel, YearofMake, ContactAddress, select } = req.body
    
    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');
    const requestId = uuidv4();
    
    config = {
        headers: {
            'Authorization': `Basic ${base64}`
        }
    }
    
    const body = {
        request_id: requestId,
        billersCode: plateNumber,
        serviceID: service,
        variation_code: variation,
        amount: amount,
        phone: phone,
        Insured_Name: name,
        Engine_Number: engineNumber,
        Chasis_Number: chasisNumber,
        Plate_Number: plateNumber,
        Vehicle_Make: vehicleMake,
        Vehicle_Color: vehicleColor,
        Vehicle_Model: vehicleModel,
        Year_of_Make: YearofMake,
        Contact_Address: ContactAddress
    }
    
    const userId = await Wallet.findById(req.user.walletId)

    axios.post(`${process.env.insurance}`, body, config)
        .then(res => {
            console.log(res.data)
        })
        .catch(err => console.log(err))
})

module.exports = router;*/
