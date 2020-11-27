const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose")
const express = require("express");
const app = express();
const router = express.Router()
const multer = require('multer')
require("dotenv").config()

// routes
const user = require("./routes/user.js")
const wallet = require("./routes/wallet")
const airtime = require("./routes/airtime")
const electric = require('./routes/Electric')
//const insurance = require('./routes/insurance')
const data = require('./routes/Data')
const kyc = require('./routes/KYCandBVN')

// middleware
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('prod'))

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err))

// router middleware
app.use(express.json());
app.use('/api', user);
app.use('/api', wallet);
app.use('/api', airtime);
app.use('/api', electric)
//app.use('/api', insurance);
app.use('/api', data)
app.use('/api', kyc)

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`)
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
      return cb(res.status(400).end('only jpg, png, jpeg is allowed'), false);
    }
    cb(null, true)
  }
})

const uploads = multer({ storage: storage })

const uploaded = uploads.fields([{ name: 'caccertificate', maxCount: 1}, { name: 'idcard', maxCount: 1}, { name: 'bill', maxCount: 1}, { name: 'passport', maxCount: 1}])

router.post("/api/companyUpdate", uploaded, (req, res) => {
    const { user_id, companyname, companyaddress, homeaddress, alternatephone, localgov, State, identity, talk } = req.body
    const { caccertificate, idcard, passport, bill } = req.files
    
    User.findOneAndUpdate(user_id, { companyname, companyaddress, homeaddress, alternatephone, localgov, State, identity, talk, caccertificate, passport, bill, idcard }, function (err, user) {
        if (err || !user) {
           return res.status(400).json({
            msg: "User does not exist"
        })
       } else {
         res.status(200).json({
           msg: `Thanks for updating your profile`
         });
       }
    })
})

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
