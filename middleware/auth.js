const jwt = require('jsonwebtoken')
const User = require('../model/User')

module.exports = async function(req, res, next) {
	const token = req.header('x-auth-token')
	if (!token) return res.status(401).json({msg: 'Access denied. Unauthorized'})

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			const { _id } = decoded;
			req.user = await User.findById(_id);
			next();
		} catch (err) {
			res.status(400).json({msg: 'Invalid Token'})
		}
}
