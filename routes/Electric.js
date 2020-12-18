const Wallet = require('../model/Wallet')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')
const { v4: uuidv4 } = require('uuid');
const Electric = require("../model/Electric")
const Verify = require("../model/Verify")

router.get('/verifyNumber', auth, async (req, res) => {
	const verify = await Verify.find({ walletId: req.user.walletId })
	res.json(verify)
})

router.post('/verifyNumber', auth, async (req, res, error) => {
	const { meter, service, select, transactionId } = req.body
	//console.log(req.body)
	
	const user = `${process.env.email_login}:${process.env.password_login}`
	const base64 = Buffer.from(user).toString('base64');
	
	config = {
		headers: {
			'Authorization': `Basic ${base64}`
		}
	}
	
	const body = {
		billersCode: meter,
		serviceID: service,
		type: select
	}

	console.log(body);
	
	const userId = await Wallet.findById(req.user.walletId)
	
	axios.post(`${process.env.verifyMeterNumber}`, body, config)
		.then(response => {
			const verify = new Verify({
				Customer_Name: response.data.content.Customer_Name,
				Meter_Number: response.data.content.Meter_Number,
				Address: response.data.content.Address,
				transactionID: req.body.transactionId,
				walletId: userId._id,
				select: select
			})
			
			if(response.data.content.WrongBillersCode == false) {
				verify.save();
				res.status(200).json({
					verify,
					success: true,
					msg: "success"
				})
				return
			} else {
				throw err
			}
		})
		.catch(err => {
			res.status(400).json({
				success: false,
				msg: "Incorrect meter number. Please try with a correct one"
			})
		})
})

router.post('/prepaidMeterPayment', auth, async (req, res) => {
    const { name, AmountInt, meter, service, select, phone } = req.body
    
    const requestId = uuidv4();

    const user = `${process.env.email_login}:${process.env.password_login}`
    const base64 = Buffer.from(user).toString('base64');

    const config = {
			headers: {
				"Authorization": `Basic ${base64}`
			}
		}

    const body = {
			request_id: requestId,
			serviceID: service,
			billerCode: meter,
			variation_code: select,
			amount: AmountInt,
			phone: phone
    }
    
    const userId = await Wallet.findById(req.user.walletId)

    //if(userId.wallet < AmountInt) {
        // res.status(400).json({
        //     msg: "Wallet balance is low. please fund account"
        // })
        // return
    //} else {
	axios.post(`${process.env.prepaidMeterPayment}`, body, config)
		.then(res => {
			console.log(res.data)
			const electric = new Electric({
				Customer_Name: res.data.content.Customer_Name, 
				Meter_Number: meter, 
				Address: res.data.content.Address, 
				walletId: userId._id, 
				type: res.data.content.type, 
				date: res.data.transaction_date.date, 
				response_description: res.data.response_description, 
				amount: AmountInt, 
				product_name: res.data.content.product_name 
			})
			electric.save();
			if (res.data.response_description === "BELOW MINIMUM AMOUNT ALLOWED") {
				throw err
			} else {
				res.status(200).json({
							msg: 'success'
				})
			}
		})
		.catch(err => {
			res.status(400).json({
				msg: "Below minimum amount allowed"
			})
		})
})
    
router.post('/postpaidMeterPayment', auth, async (req, res) => {
	const { name, AmountInt, meter, service, select, phone } = req.body
	
	const requestId = uuidv4();

	const user = `${process.env.email_login}:${process.env.password_login}`
	const base64 = Buffer.from(user).toString('base64');

	const config = {
		headers: {
			"Authorization": `Basic ${base64}`
		}
	}

	const body = {
		request_id: requestId,
		serviceID: service,
		billerCode: meter,
		variation_code: select,
		amount: AmountInt,
		phone: phone
	}
	
	const userId = await Wallet.findById(req.user.walletId)
	
	// if(userId.wallet < AmountInt) {
	// 		res.status(400).json({
	// 				msg: "Wallet balance is low. please fund account"
	// 		})
	// 		return
	// } else {
	axios.post(`${process.env.postpaidMeterPayment}`, body, config)
		.then(res => {
			console.log(res.data)
			const electric = new Electric({
				Customer_Name: res.data.content.Customer_Name, 
				Meter_Number: meter, 
				Address: res.data.content.Address, 
				walletId: userId._id, 
				type: res.data.content.type, 
				date: res.data.transaction_date.date, 
				response_description: res.data.response_description, 
				amount: AmountInt,
				select: select,
				product_name: res.data.content.product_name 
			})
			electric.save();
			if (res.data.response_description === "BELOW MINIMUM AMOUNT ALLOWED") {
				throw err
			} else {
				res.status(200).json({
							msg: 'success'
				})
			}
		})
		.catch(err => {
			res.status(400).json({
				msg: "Below minimum amount allowed"
			})
		})
			// }   
})
    

// prepaid single query
router.post('/DataTransaction', auth, async (req, res) => {
	const { AmountInt, service, phone, variation } = req.body
	const requestId = uuidv4();

	const user = `${process.env.email_login}:${process.env.password_login}`
	const base64 = Buffer.from(user).toString('base64');
	
	const uniqueId = uuidv4();

	const config = {
		headers: {
			"Authorization": `Basic ${base64}`
		}
	}

	const body = {
		request_id: requestId,
		serviceID: service,
		amount: AmountInt,
		billersCode: phone,
		variation_code: variation,
		amount: AmountInt,
		phone: phone
	}
    
	const userId = await Wallet.findById(req.user.walletId)

	axios.post(`${process.env.singleElectric}`, body, config)
		.then(res => {
				const trans = new Transaction({
					amount: response.data.content.transactions.amount,
					requestId: req.body.trans,
					product_name: response.data.content.transactions.type,
					date: response.data.transaction_date.date,
					total_amount: response.data.content.transactions.total_amount,
					transactionId: response.data.content.transactions.transactionId,
					status: response.data.response_description,
					walletId: userId._id,
					uniqueId: uniqueId
				})
				//trans.save();
				if(response.data.content.transactionId == response.data.content.transactionId) {
					res.status(200).json({
						transaction,
						success: true,
						msg: "success"
					})
					return
				} else {
					const transaction = new Transaction({
						status: response.data.response_description
					})
					transaction.save();
					throw err
				}
		})
		.catch(err => res.status(400).json({
			msg: "Error occured while querying transaction"
		}))
})

    
module.exports = router;
