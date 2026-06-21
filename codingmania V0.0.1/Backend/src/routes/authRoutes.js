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
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');

// OTP routes — otpLimiter on "send" (email abuse), authLimiter on "verify" (brute force)
router.post('/signup/send-otp', otpLimiter, authController.sendSignupOTP);
router.post('/signup/verify-otp', authLimiter, authController.verifySignupOTP);
router.post('/login/send-otp', otpLimiter, authController.sendLoginOTP);
router.post('/login/verify-otp', authLimiter, authController.verifyLoginOTP);
router.post('/admin/login/send-otp', otpLimiter, authController.sendAdminLoginOTP);
router.post('/admin/login/verify-otp', authLimiter, authController.verifyAdminLoginOTP);

// Alumni OTP routes
router.post('/alumni/signup/send-otp', otpLimiter, authController.sendAlumniSignupOTP);
router.post('/alumni/signup/verify-otp', authLimiter, authController.verifyAlumniSignupOTP);
router.post('/alumni/signup/verify-otp-with-avatar', authLimiter, profileUpload.single('avatar'), authController.verifyAlumniSignupOTPWithAvatar);
router.post('/alumni/login/send-otp', otpLimiter, authController.sendAlumniLoginOTP);
router.post('/alumni/login/verify-otp', authLimiter, authController.verifyAlumniLoginOTP);

// Forgot password (sends email → strict)
router.post('/forgot-password', otpLimiter, authController.forgotPassword);

// Google Sign-In
router.post('/google', authLimiter, authController.googleAuth);

module.exports = router;
