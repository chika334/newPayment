const express = require("express")
const router = express.Router()
const User = require("../model/User")
const multer = require('multer')
const app = express();

router.post("/kyc-bvn", (req, res) => {
    const { _id, firstname, middlename, lastname, birthday, bvn, bvnphone } = req.body
    if (firstname === "" || lastname === "" || middlename === "" || birthday === "" || bvn === "" || bvnphone === "") {
        return res.status(400).json({
            msg: "Input all fields"
        })
    }
    User.findOneAndUpdate(_id, { firstname, middlename, lastname, birthday, bvn, bvnphone }, function (err, user) {
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


module.exports = router
