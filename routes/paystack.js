const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

router.get(`/paystack`, auth, async (req, res) => {
	const reference = req.query.reference;
	let output;
	await axios
		.get(`https://api.paystack.co/transaction/verify/${reference}`, {
			headers: {
				authorization: 'Bearer pk_test_720ee3c85df4694c61d2e3a44af54094fbe26703',
				'content-type': 'application/json',
				'cache-control': 'no-cache'
			}
		})
		.then((success) => {
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

module.exports = router;
