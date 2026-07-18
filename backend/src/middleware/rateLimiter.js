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
 * General rate limiter
 * 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  store: getRedisStore('rl:general:'),
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
  store: getRedisStore('rl:auth:'),
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
  store: getRedisStore('rl:api:'),
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
  store: getRedisStore('rl:mpesa:'),
});

export default {
  generalLimiter,
  authLimiter,
  apiLimiter,
  mpesaLimiter,
};
