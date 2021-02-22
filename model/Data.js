const mongoose = require("mongoose")

const DataSchema = new mongoose.Schema({
    userId: String,
    amount: String,
    requestId: String,
    product_name: String,
    date: String,
    total_amount: String,
    transactionId: String,
    status: String,
}, { timestamp: true })

module.exports = mongoose.model('Data', DataSchema)
