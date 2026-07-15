import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis.js';

/**
 * General rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:general:',
      })
    : undefined,
});

/**
 * Auth rate limiter
 * 5 requests per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:auth:',
      })
    : undefined,
});

/**
 * API rate limiter
 * 1000 requests per hour
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  message: 'API rate limit exceeded, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:api:',
      })
    : undefined,
});

/**
 * M-Pesa rate limiter
 * 10 requests per minute
 */
export const mpesaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: 'Too many M-Pesa requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        client: redisClient,
        prefix: 'rl:mpesa:',
      })
    : undefined,
});

export default {
  generalLimiter,
  authLimiter,
  apiLimiter,
  mpesaLimiter,
};
