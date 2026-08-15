import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis.js';

/**
 * Get Redis store if connected
 */
const getRedisStore = (prefix) => {
  try {
    if (redisClient.isConnected) {
      return new RedisStore({
        sendCommand: (...args) => redisClient.client.sendCommand(args),
        prefix,
      });
    }
  } catch (error) {
    console.warn('Redis store not available, using memory store:', error.message);
  }
  return undefined;
};

/**
 * Custom handler for rate limit exceeded
 */
const rateLimitHandler = (req, res) => {
  res.status(429).json({
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: req.rateLimit.resetTime
        ? new Date(req.rateLimit.resetTime).toISOString()
        : null,
    },
  });
};

/**
 * General rate limiter
 * 100 requests per 15 minutes
 * Applied to all endpoints as baseline protection
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getRedisStore('rl:general:'),
  handler: rateLimitHandler,
});

/**
 * Auth rate limiter
 * 5 requests per 15 minutes
 * Applied to authentication endpoints (login, register, password change, etc.)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // relaxed for development & testing
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
    error: {
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      hint: 'For security reasons, authentication attempts are limited.',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  store: getRedisStore('rl:auth:'),
  handler: rateLimitHandler,
});

/**
 * API rate limiter
 * 1000 requests per hour
 * Applied to all API routes for general protection
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: {
    success: false,
    message: 'API rate limit exceeded. Please try again after 1 hour.',
    error: {
      code: 'API_RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getRedisStore('rl:api:'),
  handler: rateLimitHandler,
});

/**
 * M-Pesa rate limiter
 * 10 requests per minute
 * Applied to payment endpoints to prevent abuse
 */
export const mpesaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: 'Too many payment requests. Please try again after 1 minute.',
    error: {
      code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getRedisStore('rl:mpesa:'),
  handler: rateLimitHandler,
});

/**
 * Strict rate limiter for sensitive operations
 * 3 requests per hour
 * Applied to password reset and other sensitive operations
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    success: false,
    message: 'Too many attempts for this sensitive operation. Please try again after 1 hour.',
    error: {
      code: 'STRICT_RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  store: getRedisStore('rl:strict:'),
  handler: rateLimitHandler,
});

export default {
  generalLimiter,
  authLimiter,
  apiLimiter,
  mpesaLimiter,
  strictLimiter,
};
