const Razorpay = require('razorpay');
const dotenv = require('dotenv');

dotenv.config();

// Only create the Razorpay instance if keys are configured.
// (The constructor throws if key_id is missing — this keeps the server
//  bootable with empty placeholder keys until real keys are added.)
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
} else {
    console.warn(
        '⚠️  Razorpay keys not set in .env — payments are disabled until RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are added.'
    );
}

module.exports = razorpay;
