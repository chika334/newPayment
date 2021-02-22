const mongoose = require("mongoose")

const VerifysmartCard = new mongoose.Schema({
    Customer_Name: String,
    Smartcard_Number: String,
    Customer_ID: String,
    userId: String,
    transactionID: String,
    select: String
}, { timestamp: true })

module.exports = mongoose.model('Smartcard', VerifysmartCard)
