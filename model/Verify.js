const mongoose = require("mongoose")

const VerifyelectricSchema = new mongoose.Schema({
    Customer_Name: String,
    Meter_Number: String,
    Address: String,
    walletId: String,
    transactionID: String
}, { timestamp: true })

module.exports = mongoose.model('Verify', VerifyelectricSchema)
