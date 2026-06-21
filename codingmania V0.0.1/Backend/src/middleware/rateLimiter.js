// src/middleware/rateLimiter.js
// Rate limiting strategy (kept minimal to stay inside Upstash's free tier):
//   • apiLimiter  -> in-memory (NO Redis commands; runs on every API request)
//   • authLimiter -> Upstash Redis if configured, else in-memory  (login / OTP verify)
//   • otpLimiter  -> Upstash Redis if configured, else in-memory  (OTP / email sends)
//
// Only the low-frequency auth/OTP endpoints touch Redis, so command usage stays
// tiny (a few per user per month). Set these env vars to enable Redis:
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
const rateLimit = require('express-rate-limit');
const { Ratelimit } = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');

const json = (message) => ({ error: 'Too many requests', message });

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Wrap an Upstash Ratelimit instance as Express middleware.
// `analytics: false` keeps it to ~1 Redis command per check.
function upstashLimiter({ tokens, window, prefix, message }) {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    prefix,
    analytics: false,
  });

  return async (req, res, next) => {
    try {
      const id = req.ip || 'unknown';
      const { success, limit, remaining, reset } = await limiter.limit(id);
      res.setHeader('RateLimit-Limit', limit);
      res.setHeader('RateLimit-Remaining', Math.max(0, remaining));
      res.setHeader('RateLimit-Reset', Math.max(0, Math.ceil((reset - Date.now()) / 1000)));
      if (!success) return res.status(429).json(json(message));
      return next();
    } catch (err) {
      // Fail OPEN: if Redis hiccups, don't lock real users out.
      console.error('Rate limit (Upstash) error:', err.message);
      return next();
    }
  };
}

// In-memory fallback factory
const memoryLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: json(message),
  });

// General safety net for the whole API — always in-memory (zero Redis cost).
const apiLimiter = memoryLimiter(
  15 * 60 * 1000,
  1000,
  'You have made too many requests. Please try again later.'
);

let authLimiter;
let otpLimiter;

if (hasUpstash) {
  authLimiter = upstashLimiter({
    tokens: 30,
    window: '15 m',
    prefix: 'rl:auth',
    message: 'Too many authentication attempts. Please wait 15 minutes and try again.',
  });
  otpLimiter = upstashLimiter({
    tokens: 5,
    window: '10 m',
    prefix: 'rl:otp',
    message: 'Too many OTP requests. Please wait a few minutes before requesting another code.',
  });
  console.log('🔒 Rate limiting: auth/OTP backed by Upstash Redis');
} else {
  authLimiter = memoryLimiter(
    15 * 60 * 1000,
    30,
    'Too many authentication attempts. Please wait 15 minutes and try again.'
  );
  otpLimiter = memoryLimiter(
    10 * 60 * 1000,
    5,
    'Too many OTP requests. Please wait a few minutes before requesting another code.'
  );
  console.log('🔒 Rate limiting: in-memory (set UPSTASH_REDIS_REST_URL & UPSTASH_REDIS_REST_TOKEN to use Redis)');
}

module.exports = { apiLimiter, authLimiter, otpLimiter };
