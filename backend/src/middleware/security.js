import rateLimit from 'express-rate-limit';
import redisClient from '../config/redis.js';

/**
 * General rate limiter
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Auth rate limiter (stricter)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});

/**
 * Account lockout after failed logins
 */
export const checkAccountLockout = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !redisClient.isConnected) return next();

    const lockoutKey = `lockout:${email}`;
    const attemptsKey = `attempts:${email}`;

    // Check if account is locked
    const isLocked = await redisClient.get(lockoutKey);
    if (isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked. Please try again later.',
      });
    }

    // Get failed attempts
    const attemptsData = await redisClient.get(attemptsKey);
    const attempts = attemptsData ? parseInt(attemptsData) : 0;

    // If 5 or more failed attempts, lock account for 30 minutes
    if (attempts >= 5) {
      await redisClient.set(lockoutKey, '1', 1800); // 30 minutes
      await redisClient.del(attemptsKey);
      
      return res.status(423).json({
        success: false,
        message: 'Account locked due to too many failed attempts. Please try again in 30 minutes.',
      });
    }

    next();
  } catch (error) {
    console.error('Account lockout check error:', error);
    next();
  }
};

/**
 * Track failed login attempts
 */
export const trackFailedLogin = async (email) => {
  try {
    if (!redisClient.isConnected) return;
    
    const attemptsKey = `attempts:${email}`;
    const attemptsData = await redisClient.get(attemptsKey);
    const attempts = attemptsData ? parseInt(attemptsData) : 0;
    await redisClient.set(attemptsKey, attempts + 1, 900); // 15 minutes
  } catch (error) {
    console.error('Track failed login error:', error);
  }
};

/**
 * Clear failed login attempts on success
 */
export const clearFailedLogins = async (email) => {
  try {
    if (!redisClient.isConnected) return;
    
    const attemptsKey = `attempts:${email}`;
    await redisClient.del(attemptsKey);
  } catch (error) {
    console.error('Clear failed logins error:', error);
  }
};

/**
 * Password complexity validation
 */
export const validatePasswordComplexity = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Input sanitization middleware
 */
export const sanitizeInput = (req, res, next) => {
  // Remove any script tags or dangerous HTML
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        obj[key] = sanitize(obj[key]);
      });
    }
    return obj;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);

  next();
};

/**
 * CSRF token validation (for state-changing operations)
 */
export const validateCSRF = (req, res, next) => {
  // Skip for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;

  if (!token || token !== sessionToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token',
    });
  }

  next();
};

/**
 * Secure headers middleware
 */
export const setSecureHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS filter
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  next();
};

/**
 * API versioning middleware
 */
export const apiVersion = (version) => {
  return (req, res, next) => {
    req.apiVersion = version;
    next();
  };
};

export default {
  generalLimiter,
  authLimiter,
  checkAccountLockout,
  trackFailedLogin,
  clearFailedLogins,
  validatePasswordComplexity,
  sanitizeInput,
  validateCSRF,
  setSecureHeaders,
  apiVersion,
};
