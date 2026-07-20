import validator from 'validator';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * Maximum payload sizes (bytes)
 */
const MAX_PAYLOAD_SIZES = {
  json: 10 * 1024 * 1024, // 10MB (already set in app.js)
  text: 1 * 1024 * 1024,   // 1MB
  urlencoded: 10 * 1024 * 1024, // 10MB
  file: 50 * 1024 * 1024,  // 50MB for file uploads
};

/**
 * Dangerous patterns to detect and block
 */
const DANGEROUS_PATTERNS = {
  // SQL Injection patterns
  sqlInjection: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(;|\-\-|\/\*|\*\/|xp_|sp_)/gi,
    /('|"|`)(.*?)\1\s*(OR|AND)\s*\1/gi,
  ],
  
  // XSS patterns
  xss: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /<embed\b[^<]*>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=, onload=
  ],
  
  // Command Injection
  commandInjection: [
    /[;&|`$()]/g,
    /\$\{.*?\}/g,
    /\$\(.*?\)/g,
  ],
  
  // Path Traversal
  pathTraversal: [
    /\.\.[\/\\]/g,
    /\.\.%2[fF]/g,
  ],
  
  // NoSQL Injection
  noSqlInjection: [
    /\$where/gi,
    /\$ne/gi,
    /\$gt/gi,
    /\$gte/gi,
    /\$lt/gi,
    /\$lte/gi,
    /\$regex/gi,
  ],
};

/**
 * Check for malicious patterns in string
 */
const containsMaliciousPattern = (str, patternType = 'all') => {
  if (typeof str !== 'string') return false;

  const patternsToCheck = patternType === 'all' 
    ? Object.values(DANGEROUS_PATTERNS).flat()
    : DANGEROUS_PATTERNS[patternType] || [];

  return patternsToCheck.some(pattern => pattern.test(str));
};

/**
 * Sanitize string input
 */
const sanitizeString = (value, options = {}) => {
  if (typeof value !== 'string') return value;

  const {
    maxLength = 10000,
    allowHtml = false,
    stripHtml = true,
    trim = true,
  } = options;

  let sanitized = value;

  // Trim whitespace
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Check length
  if (sanitized.length > maxLength) {
    throw new ApiError(400, `Input exceeds maximum length of ${maxLength} characters`);
  }

  // Strip HTML if not allowed
  if (!allowHtml && stripHtml) {
    sanitized = validator.stripLow(sanitized);
    sanitized = sanitized
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^<]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  // Escape HTML entities
  sanitized = validator.escape(sanitized);

  // Check for SQL injection patterns
  if (containsMaliciousPattern(sanitized, 'sqlInjection')) {
    logger.warn(`Potential SQL injection attempt detected: ${sanitized.substring(0, 100)}`);
    throw new ApiError(400, 'Invalid input detected. Please check your data.');
  }

  // Check for command injection
  if (containsMaliciousPattern(sanitized, 'commandInjection')) {
    logger.warn(`Potential command injection attempt detected: ${sanitized.substring(0, 100)}`);
    throw new ApiError(400, 'Invalid input detected. Please check your data.');
  }

  return sanitized;
};

/**
 * Sanitize object recursively
 */
const sanitizeObject = (obj, depth = 0, maxDepth = 10) => {
  if (depth > maxDepth) {
    throw new ApiError(400, 'Input object is too deeply nested');
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    if (obj.length > 1000) {
      throw new ApiError(400, 'Array size exceeds maximum limit of 1000 items');
    }
    return obj.map(item => sanitizeObject(item, depth + 1, maxDepth));
  }

  if (typeof obj === 'object') {
    const keys = Object.keys(obj);
    if (keys.length > 100) {
      throw new ApiError(400, 'Object has too many properties (max 100)');
    }

    const sanitized = {};
    for (const key of keys) {
      // Sanitize key name
      const sanitizedKey = sanitizeString(key, { maxLength: 100, stripHtml: true });
      
      // Skip proto pollution attempts
      if (['__proto__', 'constructor', 'prototype'].includes(sanitizedKey.toLowerCase())) {
        logger.warn(`Prototype pollution attempt detected: ${sanitizedKey}`);
        continue;
      }

      sanitized[sanitizedKey] = sanitizeObject(obj[key], depth + 1, maxDepth);
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  // Numbers, booleans, etc. pass through
  return obj;
};

/**
 * Main sanitization middleware
 */
export const sanitizeInput = (req, res, next) => {
  try {
    // Sanitize request body
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitizeObject(req.params);
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    
    logger.error('Sanitization error:', error);
    return res.status(400).json({
      success: false,
      message: 'Invalid input data',
    });
  }
};

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic length check
  if (email.length > 254) return false;

  // Use validator library
  if (!validator.isEmail(email)) {
    return false;
  }

  // Additional checks
  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  
  // Local part checks
  if (local.length > 64) return false;
  if (local.startsWith('.') || local.endsWith('.')) return false;
  if (local.includes('..')) return false;

  // Domain checks
  if (domain.length > 253) return false;

  return true;
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }

  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it contains only numbers and optional leading +
  if (!/^\+?\d{10,15}$/.test(cleaned)) {
    return false;
  }

  return true;
};

/**
 * Validate UUID
 */
export const validateUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }

  return validator.isUUID(uuid);
};

/**
 * Validate URL
 */
export const validateURL = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }

  if (url.length > 2048) return false;

  return validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
  });
};

/**
 * Sanitize filename
 */
export const sanitizeFilename = (filename) => {
  if (!filename || typeof filename !== 'string') {
    throw new ApiError(400, 'Invalid filename');
  }

  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\.[\/\\]/g, '');
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '');
  
  // Limit length
  if (sanitized.length > 255) {
    sanitized = sanitized.substring(0, 255);
  }

  // Ensure it's not empty after sanitization
  if (!sanitized) {
    throw new ApiError(400, 'Invalid filename after sanitization');
  }

  return sanitized;
};

/**
 * Check request payload size
 */
export const checkPayloadSize = (maxSize = MAX_PAYLOAD_SIZES.json) => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || 0);

    if (contentLength > maxSize) {
      logger.warn(`Oversized payload rejected: ${contentLength} bytes (max: ${maxSize})`);
      return res.status(413).json({
        success: false,
        message: `Payload too large. Maximum size is ${Math.floor(maxSize / 1024 / 1024)}MB`,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          maxSize: maxSize,
          receivedSize: contentLength,
        },
      });
    }

    next();
  };
};

/**
 * Validate and sanitize specific field types
 */
export const validateField = (field, value, type, options = {}) => {
  switch (type) {
    case 'email':
      if (!validateEmail(value)) {
        throw new ApiError(400, `Invalid email format for field: ${field}`);
      }
      return validator.normalizeEmail(value);

    case 'phone':
      if (!validatePhone(value)) {
        throw new ApiError(400, `Invalid phone number format for field: ${field}`);
      }
      return value.replace(/[\s\-\(\)]/g, '');

    case 'uuid':
      if (!validateUUID(value)) {
        throw new ApiError(400, `Invalid UUID format for field: ${field}`);
      }
      return value;

    case 'url':
      if (!validateURL(value)) {
        throw new ApiError(400, `Invalid URL format for field: ${field}`);
      }
      return value;

    case 'number':
      const num = Number(value);
      if (isNaN(num)) {
        throw new ApiError(400, `Invalid number for field: ${field}`);
      }
      if (options.min !== undefined && num < options.min) {
        throw new ApiError(400, `${field} must be at least ${options.min}`);
      }
      if (options.max !== undefined && num > options.max) {
        throw new ApiError(400, `${field} must not exceed ${options.max}`);
      }
      return num;

    case 'string':
      return sanitizeString(value, options);

    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (value === 'true' || value === '1' || value === 1) return true;
      if (value === 'false' || value === '0' || value === 0) return false;
      throw new ApiError(400, `Invalid boolean value for field: ${field}`);

    case 'date':
      if (!validator.isISO8601(String(value))) {
        throw new ApiError(400, `Invalid date format for field: ${field}`);
      }
      return new Date(value);

    default:
      return value;
  }
};

/**
 * Block requests with suspicious patterns in headers
 */
export const validateHeaders = (req, res, next) => {
  const suspiciousHeaders = ['x-forwarded-for', 'x-real-ip', 'referer', 'user-agent'];
  
  for (const header of suspiciousHeaders) {
    const value = req.headers[header];
    if (value && typeof value === 'string') {
      if (containsMaliciousPattern(value)) {
        logger.warn(`Malicious pattern detected in ${header} header`);
        return res.status(400).json({
          success: false,
          message: 'Invalid request headers',
        });
      }
    }
  }

  next();
};

/**
 * Prevent mass assignment vulnerabilities
 */
export const allowedFields = (allowedFieldsList) => {
  return (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      const receivedFields = Object.keys(req.body);
      const disallowedFields = receivedFields.filter(
        field => !allowedFieldsList.includes(field)
      );

      if (disallowedFields.length > 0) {
        logger.warn(`Disallowed fields detected: ${disallowedFields.join(', ')}`);
        return res.status(400).json({
          success: false,
          message: 'Invalid fields in request',
          disallowedFields,
        });
      }
    }

    next();
  };
};

export default {
  sanitizeInput,
  sanitizeString,
  sanitizeObject,
  sanitizeFilename,
  validateEmail,
  validatePhone,
  validateUUID,
  validateURL,
  validateField,
  validateHeaders,
  checkPayloadSize,
  allowedFields,
  MAX_PAYLOAD_SIZES,
};
