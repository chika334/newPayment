const mongoose = require("mongoose")

const ElectricSchema = new mongoose.Schema({
    Customer_Name: String,
    Meter_Number: String,
    Address: String,
    // walletId: String,
    type: String,
    date: String,
    response_description: String,
    amount: String,
    product_name: String,
    select: String,
    transactionID: String
}, { timestamp: true })

module.exports = mongoose.model('Electric', ElectricSchema)
