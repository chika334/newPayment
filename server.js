const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose")
const express = require("express");
const app = express();
require("dotenv").config()

// routes
const user = require("./routes/user.js")

// middleware
app.use(cors({origin: true, credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
.then(() => console.log("Connected to DB"))
.catch(err => console.log(err))


// router middleware
app.use(express.json());
app.use('/api', user);

const PORT = process.env.NODE_ENV || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})
