const mongoose = require("mongoose")

const ElectricSchema = new mongoose.Schema({
    Customer_Name: String,
    Meter_Number: String,
    Address: String,
    walletId: String
}, { timestamp: true })

module.exports = mongoose.model('Electric', ElectricSchema)
