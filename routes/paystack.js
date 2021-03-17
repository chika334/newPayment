const express = require('express');
const router = express.Router();
const axios = require('axios');
const unirest = require('unirest'); //unirest is an http request library so any other preferred library can be used.
const auth = require('../middleware/auth');

// router.get('/paystack', async (req, res) => {
// 	const ref = req.query.reference;
// 	console.log(ref);
// 	// let output;
// 	// await axios
// 	// 	.get(`https://api.paystack.co/transaction/verify/${ref}`, {
// 	// 		headers: {
// 	// 			authorization: 'Bearer sk_test_f85f819b644d84c213774720b1f268abe0e84782',
// 	// 			//replace TEST SECRET KEY with your actual test secret
// 	// 			//key from paystack
// 	// 			'content-type': 'application/json',
// 	// 			'cache-control': 'no-cache'
// 	// 		}
// 	// 	})
// 	// 	.then((success) => {
// 	// 		output = success;
// 	// 		// console.log(success);
// 	// 	})
// 	// 	.catch((error) => {
// 	// 		output = error;
// 	// 	});

// 	// //we return the output of the transaction
// 	res.status(200).send('Payment was successfully verified');
// });

router.post('/flutterwave', async (req, res) => {
	console.log(req.body);

	var payload = {
		SECKEY: `${process.env.FLUTTERWAVE_SECRET}`,
		txref: 'MC-1520443531487'
	};

	var server_url = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/verify';
	//please make sure to change this to production url when you go live

	//make a post request to the server
	unirest.post(server_url).headers({ 'Content-Type': 'application/json' }).send(payload).end(function(response) {
		//check status is success.
		if (response.body.data.status === 'successful' && response.body.data.chargecode == 00) {
			//check if the amount is same as amount you wanted to charge just to be very sure
			if (response.body.data.amount === '2000') {
				console.log('Payment successful');
				//then give value for the payment
			}
		}
	});
});

module.exports = router;
