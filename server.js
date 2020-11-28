const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose")
const express = require("express");
const app = express();
require("dotenv").config()

// routes
const user = require("./routes/user.js")
const wallet = require("./routes/wallet")
const airtime = require("./routes/airtime")
const electric = require('./routes/Electric')
//const insurance = require('./routes/insurance')
const data = require('./routes/Data')
const kyc = require('./routes/KYCandBVN')
const TvSub = require('./routes/TvSub')

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
app.use('/api', TvSub)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
