const mongoose = require("mongoose")

const payTVSubSchema = new mongoose.Schema({
    smartCard: String,
    userId: String,
    type: String,
    date: String,
    response_description: String,
    amount: String,
    product_name: String,
    transactionID: String
}, { timestamp: true })

module.exports = mongoose.model('TvSub', payTVSubSchema)
