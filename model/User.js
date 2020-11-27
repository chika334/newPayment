const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

const UserSchema = new mongoose.Schema({
    firstname: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
    middlename: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
	lastname: {
		type: String,
		min: 6,
		trim: true,
		require: true
	},
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
	birthday: {
		type: String,
	},
	bvn: {
		type: String,
	},
	bvnphone: {
		type: String,
	},
	walletId: String,
	companyname: String,
	companyaddress: String,
	homeaddress: String,
	alternatephone: String,
	localgov: String,
	State: String,
	identity: String,
	talk: String,
	caccertificate: {
	    path: String
	},
	passport: {
	    path: String
	},
	bill: {
	    path: String
	},
	idcard: {
	    path: String
	}
}, { timestamp: true })

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
  return token;
}

module.exports = mongoose.model('User', UserSchema)
