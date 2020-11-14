const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
		require: true
	},
	password: {
		require: true,
		type: String
	},
	role: {
		type: Number,
		default: 0
	},
	walletId: String,
}, { timestamp: true })

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
}

module.exports = mongoose.model('User', UserSchema)