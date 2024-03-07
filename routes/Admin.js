const express = require("express");
const router = express.Router();
const { Admin } = require("../app/models");
const bcrypt = require("bcrypt");
const dataValidators = require('../middleware/DataValidators');
const adminControllers = require('../app/controllers/AdminControllers');
const {validateAdmin} = require('../middleware/AuthMiddleware');
const {sendOTP,verifyOTP} = require('../middleware/EmailVerification');
const {limiter} = require('../middleware/RateLimiter');




router.post("/signup", dataValidators.signUpDataValidator,verifyOTP,adminControllers.userSignUp);
router.get('/logout', adminControllers.userLogOut);
router.post("/login", adminControllers.userLogIn);
router.get('/allusers',validateAdmin,adminControllers.getAllUser);
router.get('/edituser/:id',validateAdmin,adminControllers.editUser);
router.post("/createuser",validateAdmin, dataValidators.signUpDataValidator,adminControllers.userSignUp);
router.post('/sendotp',limiter,sendOTP);


module.exports = router;