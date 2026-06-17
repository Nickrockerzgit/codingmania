// //auth router
// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// router.post('/signup/send-otp', authController.sendSignupOTP);
// router.post('/signup/verify-otp', authController.verifySignupOTP);
// router.post('/login/send-otp', authController.sendLoginOTP);
// router.post('/login/verify-otp', authController.verifyLoginOTP);

// module.exports = router;





//after google api code 
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { profileUpload } = require('../utils/fileUpload');

// OTP routes
router.post('/signup/send-otp', authController.sendSignupOTP);
router.post('/signup/verify-otp', authController.verifySignupOTP);
router.post('/login/send-otp', authController.sendLoginOTP);
router.post('/login/verify-otp', authController.verifyLoginOTP);
router.post('/admin/login/send-otp', authController.sendAdminLoginOTP);
router.post('/admin/login/verify-otp', authController.verifyAdminLoginOTP);

// Alumni OTP routes
router.post('/alumni/signup/send-otp', authController.sendAlumniSignupOTP);
router.post('/alumni/signup/verify-otp', authController.verifyAlumniSignupOTP);
router.post('/alumni/signup/verify-otp-with-avatar', profileUpload.single('avatar'), authController.verifyAlumniSignupOTPWithAvatar);
router.post('/alumni/login/send-otp', authController.sendAlumniLoginOTP);
router.post('/alumni/login/verify-otp', authController.verifyAlumniLoginOTP);

// Forgot password
router.post('/forgot-password', authController.forgotPassword);

// Google Sign-In
router.post('/google', authController.googleAuth);

module.exports = router;
