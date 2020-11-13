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
router.post('/register', (req, res) => {
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

router.post('/updatePassword', async(req, res) => {
    const { _id, email, old_password, new_password, confirm_new_password } = req.body
    if ( new_password === "" ) {
        res.status(400).json({
            msg: "Input all Fields"
        })
    }
    
    let user = await User.findOne({ email }, (err, user) => {
        if (user != null) {
            var hash = user.password
            bcrypt.compare(old_password, hash, function(err, res) {
            //if (res) {
                // Password match
                if (new_password == confirm_new_password) {
                    bcrypt.hash(new_password, 10, function(err, hash) {
                    user.password = hash
                    user.save()
                    
                    })
                }
            //}          
            })
        }
        res.status(200).json({
            msg: email + " your password has been changed."
        })
    })
    if (!user) return res.status(400).json({ msg: 'User not found' })
    
})

module.exports = router
