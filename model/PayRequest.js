const mongoose = require("mongoose")

const PaySchema = new mongoose.Schema({
    amount: String,
    requestId: String,
    product_name: String,
    date: String,
    total_amount: String,
    transactionId: String
}, { timestamp: true })

module.exports = mongoose.model('Pay', PaySchema)
