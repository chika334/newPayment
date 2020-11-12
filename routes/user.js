const User = require('../model/User.js')
const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth.js")

router.get('/getUser', auth, async (req, res) => {
	const user = await User.findById(req.user._id).select('-Hashed_password -salt')
	res.json(user)
})

// login
router.post('/login', (req, res) => {
  // get request body
  const {email, password} = req.body;
  // check if all inputs are filled 
  if(email === "" || password === "") {
    return res.status(400).json({
      msg: "Input all fields"
    })
  }

  // check if email exists
  User.findOne({email}).exec((err, user) => {
    if(err || !user) {
      return res.status(400).json({
        msg: "User with that email does not exist"
      })
    }

    // checks if email and password are correct
    if(!user.authenticate(password)) {
      return res.status(400).json({
        msg: "Email and password do not match"
      })
    }

    // generate token
    const token = user.generateAuthToken()
    const {name, email, role} = user
    res.status(200).json({
      user: {email, name, role},
      token
    })
  })
})

// register
router.post('/user', (req, res) => {
	const {name, email, password} = req.body;
  // check if all inputs are filled
  if (name === "" || email === "" || password === "") {
    return res.status(400).json({
      msg: "Input all fields"
    })
  }
  // check if email already exists
  User.findOne({email}).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        msg: "Email address is taken"
      })
    }

    // register new user
    user = new User ({name, email, password})
    user.save();
    const {role} = user;
    const token = user.generateAuthToken();
    return res.status(200).json({
      msg: "Signup Successful",
      user: {name, email, role},
      token,
    })
  })
})

module.exports = router