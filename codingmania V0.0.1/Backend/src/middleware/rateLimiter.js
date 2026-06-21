// src/middleware/rateLimiter.js
// Centralized rate limiters to protect the API from abuse / brute-force.
const rateLimit = require('express-rate-limit');

const json = (message) => ({
  error: 'Too many requests',
  message,
});

// General safety net for the whole API (per IP).
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true, // RateLimit-* headers
  legacyHeaders: false,
  message: json('You have made too many requests. Please try again later.'),
});

// Stricter limit for authentication attempts (login / OTP verify).
// Blocks brute-forcing OTPs and passwords.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many authentication attempts. Please wait 15 minutes and try again.'),
});

// Very strict limit for sending OTPs — prevents email/SMS spamming.
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many OTP requests. Please wait a few minutes before requesting another code.'),
});

module.exports = { apiLimiter, authLimiter, otpLimiter };
