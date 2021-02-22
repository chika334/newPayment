const mongoose = require("mongoose")

const Verifyelectric = new mongoose.Schema({
    Customer_Name: String,
    Meter_Number: String,
    Address: String,
    userId: String,
    transactionID: String,
    select: String
}, { timestamp: true })

module.exports = mongoose.model('Verify', Verifyelectric)
