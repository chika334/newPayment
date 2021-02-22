const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.get(`/paystack`, async (req, res) => {
	const reference = req.query.reference;
	let output;
	await axios
		.get(`https://api.paystack.co/transaction/verify/${reference}`, {
			headers: {
				authorization: 'Bearer sk_test_f85f819b644d84c213774720b1f268abe0e84782',
				'content-type': 'application/json',
				'cache-control': 'no-cache'
			}
		})
		.then((success) => {
			output = success;
			console.log(success);
		})
		.catch((err) => console.log(err));

	//now we check for internet connectivity issues
	if (!output.response && output.status !== 200) throw new UserInputError('No internet Connection');
	//next,we confirm that there was no error in verification.
	if (output.response && !output.response.data.status)
		throw new UserInputError("Error verifying payment , 'unknown Transaction    Reference Id'");

	//  }
	//we return the output of the transaction
	res.status(200).send('Payment was successfully verified');
});

// router.get('/paystack', async (req, res) => {
// 	const ref = req.query.reference;
// 	let output;
// 	await axios
// 		.get(`https://api.paystack.co/transaction/verify/${ref}`, {
// 			headers: {
// 				authorization: 'Bearer sk_test_f85f819b644d84c213774720b1f268abe0e84782',
// 				//replace TEST SECRET KEY with your actual test secret
// 				//key from paystack
// 				'content-type': 'application/json',
// 				'cache-control': 'no-cache'
// 			}
// 		})
// 		.then((success) => {
// 			output = success;
// 			// console.log(success);
// 		})
// 		.catch((error) => {
// 			output = error;
// 		});
// 	//now we check for internet connectivity issues
// 	// if (!output.response && output.status !== 200) throw new UserInputError('No internet Connection');
// 	// //next,we confirm that there was no error in verification.
// 	// if (output.response && !output.response.data.status)
// 	// 	throw new UserInputError("Error verifying payment , 'unknown Transaction    Reference Id'");

// 	//we return the output of the transaction
// 	res.status(200).send('Payment was successfully verified');
// });

module.exports = router;
