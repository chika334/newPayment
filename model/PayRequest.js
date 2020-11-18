const mongoose = require("mongoose")

const PaySchema = new mongoose.Schema({
    amount: String
    requestId: String
}, { timestamp: true })

module.exports = mongoose.model('Pay', PaySchema)
