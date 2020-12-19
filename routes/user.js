const User = require('../model/User.js')
const express = require('express')
const router = express.Router()
const auth = require("../middleware/auth.js")
const bcrypt = require("bcrypt")
const Wallet = require('../model/Wallet')
const jwt = require("jsonwebtoken")

router.get('/auth/me', (req, res) => {
  var token = req.header('x-auth-token')
  if (!token) return res.status(401).send({ auth: false, msg: 'No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    User.findById(decoded._id, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");

      const { _id, name, email, role } = user
      
      res.status(200).send({ user: { _id, name, email, role } });
    });
  });
})

router.get('/getUser', auth, async (req, res) => {
	const user = await User.findById(req.user._id).select('-password')
	res.json(user)
})

// login
router.post('/login', async (req, res) => {
  // get request body
  const {email, password} = req.body;
  // check if all inputs are filled 
  if(email === "" || password === "") {
    return res.status(400).json({
      msg: "Input all fields"
    })
  }

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ msg: 'Invalid Email or Password.' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ msg: 'Invalid Email or Password.' });

  const token = user.generateAuthToken();
  const { _id, name, role } = user
  res.send({ user: { _id, name, email, role }, token })
})

// register
router.post('/register', async (req, res) => {
	const {name, email, password} = req.body;
  // check if all inputs are filled
  if (name === "" || email === "" || password === "") {
    return res.status(400).json({
      msg: "Input all fields"
    })
  }
  // verifies if user already exit
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).json({ msg: 'User already registered' })

  const wallet = await Wallet.create({ amount: 0 });

  // gets new users info
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    walletId: wallet._id,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt)

  // saves the details to the database
  await user.save();

  const token = user.generateAuthToken();
  const { _id, role } = user
  res.header('x-auth-token', token).send({ user: { _id, name, email, role }, token });
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
      if (res) {
        // Password match
        if (new_password == confirm_new_password) {
          bcrypt.hash(new_password, 10, function(err, hash) {
          user.password = hash
          user.save()
          
          })
        }
      }          
      })
    }
    res.status(200).json({
        msg: email + " your password has been changed."
    })
  })
  if (!user) return res.status(400).json({ msg: 'User not found' })
})

module.exports = router
