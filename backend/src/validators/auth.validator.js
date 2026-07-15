import Joi from 'joi';

/**
 * Register business validation schema
 */
export const registerBusinessSchema = Joi.object({
  businessName: Joi.string().min(2).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^\+254[17]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone must be a valid Kenyan number (+254...)',
    }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters long',
  }),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
  address: Joi.string().optional(),
  taxId: Joi.string().optional(),
});

/**
 * Login validation schema
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  remember: Joi.boolean().optional(),
});

/**
 * Forgot password validation schema
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

/**
 * Change password validation schema
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
    'any.only': 'Passwords do not match',
  }),
});

/**
 * Verify email validation schema
 */
export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

/**
 * Enable 2FA validation schema
 */
export const enable2FASchema = Joi.object({
  password: Joi.string().required(),
});

/**
 * Verify 2FA validation schema
 */
export const verify2FASchema = Joi.object({
  code: Joi.string().length(6).required(),
});

export default {
  registerBusinessSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
  refreshTokenSchema,
  enable2FASchema,
  verify2FASchema,
};
