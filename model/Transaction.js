const mongoose = require("mongoose")

const TransactionSchema = new mongoose.Schema({
    product_name: {
        type: String,
    },
    transactionId: {
        type: String
    },
    amount: {
        type: String
    },
    total_amount: {
        type: String
    },
    requestId: {
        type: String
    },
    date: {
        type: String
    },
    amount: {
        type: String
    },
    status: {
        type: String
    },
}, { timestamp: true })

module.exports = mongoose.model('Transaction', TransactionSchema)
