const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.get('/paystack', async (req, res) => {
	const ref = req.query.reference;
	console.log(ref);
	// let output;
	// await axios
	// 	.get(`https://api.paystack.co/transaction/verify/${ref}`, {
	// 		headers: {
	// 			authorization: 'Bearer sk_test_f85f819b644d84c213774720b1f268abe0e84782',
	// 			//replace TEST SECRET KEY with your actual test secret
	// 			//key from paystack
	// 			'content-type': 'application/json',
	// 			'cache-control': 'no-cache'
	// 		}
	// 	})
	// 	.then((success) => {
	// 		output = success;
	// 		// console.log(success);
	// 	})
	// 	.catch((error) => {
	// 		output = error;
	// 	});

	// //we return the output of the transaction
	// res.status(200).send('Payment was successfully verified');
});


router.get('/flutterwave', async (req, res) => {
	console.log(req);
})

module.exports = router;
