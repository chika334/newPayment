// const Wallet = require('../model/Wallet');
const express = require('express');
const User = require('../model/User');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const Transaction = require('../model/Transaction');
const Verify = require('../model/Verify');

router.get('/verifyNumber', auth, async (req, res) => {
	// const userId = await User.findById(req.user._id);
	// console.log(userId, "transactions");
	const verify = await Verify.find({ userId: req.user._id });
	res.json(verify);
});

// get all electric
router.get('/getElectric', auth, async (req, res) => {
	// const userId = await User.findById(req.user._id);
	// console.log(userId, "transactions");
	const transaction = await Transaction.find({ walletId: req.user.walletId });
	res.status(200).json(transaction);
});

router.post('/verifyNumber', auth, async (req, res, error) => {
	const { meter, service, select, transactionId } = req.body;

	const user = `${process.env.email_login}:${process.env.password_login}`;
	const base64 = Buffer.from(user).toString('base64');

	config = {
		headers: {
			Authorization: `Basic ${base64}`
		}
	};

	const body = {
		billersCode: meter,
		serviceID: service,
		type: select
	};

	// const userId = await Wallet.findById(req.user.walletId);

	axios
		.post(`${process.env.verifyMeterNumber}`, body, config)
		.then((response) => {
			const verify = new Verify({
				Customer_Name: response.data.content.Customer_Name,
				Meter_Number: response.data.content.Meter_Number,
				Address: response.data.content.Address,
				transactionID: req.body.transactionId,
				// walletId: userId._id,
				select: select
			});
			//verify.save();
			if (response.data.content.WrongBillersCode == false) {
				res.status(200).json({
					verify
				});
				return;
			} else {
				throw err;
			}
		})
		.catch((err) => {
			res.status(400).json({
				success: false,
				msg: 'Incorrect meter number. Please try with a correct one'
			});
		});
});

// pay prepaidMeter
router.post('/prepaidMeterPayment', auth, async (req, res) => {
	const { name, AmountInt, meter, service, select, phone } = req.body;

	const requestId = uuidv4();

	const user = `${process.env.email_login}:${process.env.password_login}`;
	const base64 = Buffer.from(user).toString('base64');

	const config = {
		headers: {
			Authorization: `Basic ${base64}`
		}
	};

	const body = {
		request_id: requestId,
		serviceID: service,
		billerCode: meter,
		variation_code: select,
		amount: AmountInt,
		phone: phone
	};

	// const userId = await Wallet.findById(req.user.walletId);
	const userId = await User.findById(req.user._id);

	axios
		.post(`${process.env.prepaidMeterPayment}`, body, config)
		.then((res) => {
			console.log(res.data);
			const transaction = new Transaction({
				Customer_Name: res.data.content.Customer_Name,
				Meter_Number: meter,
				Address: res.data.content.Address,
				userId: userId._id,
				type: res.data.content.type,
				date: res.data.transaction_date.date,
				response_description: res.data.response_description,
				amount: AmountInt,
				product_name: res.data.content.product_name
			});
			transaction.save();
			if (res.data.response_description === 'TRANSACTION SUCCESSFUL') {
				res.status(200).json({
					transaction,
					msg: 'success'
				});
				return;
			} else {
				throw err;
			}
			// if (res.data.response_description === 'BELOW MINIMUM AMOUNT ALLOWED') {
			// 	throw err;
			// } else {
			// 	res.status(200).json({
			// 		msg: 'success'
			// 	});
			// }
		})
		.catch((err) => {
			res.status(400).json({
				msg: 'Below minimum amount allowed'
			});
		});
	// }
});

// pay postpaidMeter
router.post('/postpaidMeterPayment', auth, async (req, res) => {
	const { name, AmountInt, meter, service, select, phone } = req.body;

	const requestId = uuidv4();

	const user = `${process.env.email_login}:${process.env.password_login}`;
	const base64 = Buffer.from(user).toString('base64');

	const config = {
		headers: {
			Authorization: `Basic ${base64}`
		}
	};

	const body = {
		request_id: requestId,
		serviceID: service,
		billerCode: meter,
		variation_code: select,
		amount: AmountInt,
		phone: phone
	};

	// const userId = await Wallet.findById(req.user.walletId);
	const userId = await User.findById(req.user._id);

	axios
		.post(`${process.env.postpaidMeterPayment}`, body, config)
		.then((res) => {
			console.log(res.data);
			const transaction = new Transaction({
				Customer_Name: res.data.content.Customer_Name,
				Meter_Number: meter,
				Address: res.data.content.Address,
				userId: userId._id,
				type: res.data.content.type,
				date: res.data.transaction_date.date,
				response_description: res.data.response_description,
				amount: AmountInt,
				select: select,
				product_name: res.data.content.product_name
			});

			transaction.save();
			if (res.data.response_description === 'TRANSACTION SUCCESSFUL') {
				res.status(200).json({
					transaction,
					msg: 'success'
				});
				return;
			} else {
				throw err;
			}
		})
		.catch((err) => {
			res.status(400).json({
				msg: 'Below minimum amount allowed'
			});
		});
	// }
});

// single electric tranx
router.post('/ElectrictransAction', auth, async (req, res) => {
	const { trans } = req.body;
	const requestId = uuidv4();

	const user = `${process.env.email_login}:${process.env.password_login}`;
	const base64 = Buffer.from(user).toString('base64');

	const uniqueId = uuidv4();

	const config = {
		headers: {
			Authorization: `Basic ${base64}`
		}
	};

	const body = {
		request_id: trans
	};

	// const userId = await Wallet.findById(req.user.walletId);
	const userId = await User.findById(req.user._id);

	axios
		.post(`${process.env.singleElectric}`, body, config)
		.then((res) => {
			const transaction = new Transaction({
				amount: response.data.content.transactions.amount,
				requestId: req.body.trans,
				product_name: response.data.content.transactions.type,
				date: response.data.transaction_date.date,
				total_amount: response.data.content.transactions.total_amount,
				transactionId: response.data.content.transactions.transactionId,
				status: response.data.response_description,
				userId: userId._id,
				uniqueId: uniqueId
			});
			//trans.save();
			if (response.data.content.transactionId == response.data.content.transactionId) {
				res.status(200).json({
					transaction
				});
				return;
			} else {
				throw err;
			}
		})
		.catch((err) =>
			res.status(400).json({
				msg: 'Error occured while querying transaction'
			})
		);
});

module.exports = router;
