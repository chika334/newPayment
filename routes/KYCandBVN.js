const express = require('express');
const router = express.Router();
const User = require('../model/User');
const multer = require('multer');

router.post('/kyc-bvn', (req, res) => {
	const { _id, firstname, middlename, lastname, birthday, bvn, bvnphone } = req.body;
	if (firstname === '' || lastname === '' || middlename === '' || birthday === '' || bvn === '' || bvnphone === '') {
		return res.status(400).json({
			msg: 'Input all fields'
		});
	}
	User.findOneAndUpdate(_id, { firstname, middlename, lastname, birthday, bvn, bvnphone }, function(err, user) {
		if (err || !user) {
			return res.status(400).json({
				msg: 'User does not exist'
			});
		} else {
			res.status(200).json({
				msg: `Thanks for updating your profile`
			});
		}
	});
});

let Storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function(req, file, cb) {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
			return cb(res.status(400).end('Only jpg, png, jpeg are allowed'), false);
		}
		cb(null, true);
	}
});

const uploads = multer({ storage: Storage });

const uploaded = uploads.fields([
	{ name: 'caccertificate', maxCount: 1 },
	{ name: 'idcard', maxCount: 1 },
	{ name: 'bill', maxCount: 1 },
	{ name: 'passport', maxCount: 1 }
]);

router.post('/companyUpdate', uploaded, (req, res) => {
	const {
		user_id,
		companyname,
		companyaddress,
		homeaddress,
		alternatephone,
		localgov,
		State,
		identity,
		talk
	} = req.body;
	//const { caccertificate, idcard, passport, bill } = req.files

	User.findOneAndUpdate(
		user_id,
		{ companyname, companyaddress, homeaddress, alternatephone, localgov, State, identity, talk },
		function(err, user) {
			if (err || !user) {
				return res.status(400).json({
					msg: 'User does not exist'
				});
			} else {
				res.status(200).json({
					msg: `Thanks for updating your profile`
				});
			}
		}
	);
});

module.exports = router;
