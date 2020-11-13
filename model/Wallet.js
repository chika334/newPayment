const mongoose = require("mongoose")

const WalletSchema = new mongoose.schema({
    wallet: {
        type: Number,
        default: 0.00
    }
}, { timestamp: true })

module.exports = mongoose.model('Wallet', WalletSchema)
