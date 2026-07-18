import * as authService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiError from '../utils/ApiError.js';
import logger from '../config/logger.js';

/**
 * @desc    Register new business
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
  try {
    const result = await authService.registerBusiness(req.body);

    // Generate tokens for immediate login
    const loginResult = await authService.login(req.body.email, req.body.password);

    logger.info(`New business registered: ${result.business.name}`);

    return ApiResponse.created(res, 'Business registered successfully', {
      business: result.business,
      user: loginResult.user,
      tokens: loginResult.tokens,
    });
  } catch (error) {
    logger.error('Registration error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Registration failed', [error.message]);
  }
};

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    logger.info(`User logged in: ${email}`);

    return ApiResponse.success(res, 'Login successful', result);
  } catch (error) {
    logger.error('Login error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Login failed', [error.message]);
  }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const tokens = await authService.refreshAccessToken(refreshToken);

    return ApiResponse.success(res, 'Token refreshed successfully', tokens);
  } catch (error) {
    logger.error('Token refresh error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Token refresh failed', [error.message]);
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  try {
    await authService.logout(req.user.id);

    logger.info(`User logged out: ${req.user.email}`);

    return ApiResponse.success(res, 'Logout successful');
  } catch (error) {
    logger.error('Logout error:', error);
    return ApiResponse.internal(res, 'Logout failed', [error.message]);
  }
};

/**
 * @desc    Get current user
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    return ApiResponse.success(res, 'User retrieved successfully', {
      user: req.user,
      role: req.user.role,
      business: req.user.business,
      branch: req.user.branch,
    });
  } catch (error) {
    logger.error('Get current user error:', error);
    return ApiResponse.internal(res, 'Failed to get user', [error.message]);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user.id, currentPassword, newPassword);

    logger.info(`Password changed for user: ${req.user.email}`);

    return ApiResponse.success(res, 'Password changed successfully');
  } catch (error) {
    logger.error('Change password error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Password change failed', [error.message]);
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    logger.info(`Password reset requested for: ${email}`);

    return ApiResponse.success(
      res,
      'If the email exists, password reset instructions have been sent'
    );
  } catch (error) {
    logger.error('Forgot password error:', error);
    return ApiResponse.internal(res, 'Failed to process request', [error.message]);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    logger.info('Password reset successful');

    return ApiResponse.success(res, 'Password reset successful');
  } catch (error) {
    logger.error('Reset password error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Password reset failed', [error.message]);
  }
};

export default {
  register,
  login,
  refreshToken,
  logout,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
};


/**
 * @desc    Send email verification
 * @route   POST /api/v1/auth/send-verification
 * @access  Private
 */
export const sendEmailVerification = async (req, res) => {
  try {
    await authService.sendEmailVerification(req.user.id);

    logger.info(`Verification email sent to: ${req.user.email}`);

    return ApiResponse.success(res, 'Verification email sent');
  } catch (error) {
    logger.error('Send verification error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Failed to send verification email', [error.message]);
  }
};

/**
 * @desc    Verify email
 * @route   POST /api/v1/auth/verify-email
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    await authService.verifyEmail(token);

    logger.info('Email verified successfully');

    return ApiResponse.success(res, 'Email verified successfully');
  } catch (error) {
    logger.error('Verify email error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Email verification failed', [error.message]);
  }
};

/**
 * @desc    Enable two-factor authentication
 * @route   POST /api/v1/auth/2fa/enable
 * @access  Private
 */
export const enableTwoFactor = async (req, res) => {
  try {
    const result = await authService.enableTwoFactor(req.user.id);

    logger.info(`2FA setup initiated for: ${req.user.email}`);

    return ApiResponse.success(res, '2FA setup initiated', result);
  } catch (error) {
    logger.error('Enable 2FA error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Failed to enable 2FA', [error.message]);
  }
};

/**
 * @desc    Verify and activate two-factor authentication
 * @route   POST /api/v1/auth/2fa/verify
 * @access  Private
 */
export const verifyTwoFactor = async (req, res) => {
  try {
    const { token } = req.body;

    const result = await authService.verifyTwoFactor(req.user.id, token);

    logger.info(`2FA enabled for: ${req.user.email}`);

    return ApiResponse.success(res, '2FA enabled successfully', result);
  } catch (error) {
    logger.error('Verify 2FA error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Failed to verify 2FA', [error.message]);
  }
};

/**
 * @desc    Disable two-factor authentication
 * @route   POST /api/v1/auth/2fa/disable
 * @access  Private
 */
export const disableTwoFactor = async (req, res) => {
  try {
    const { password } = req.body;

    await authService.disableTwoFactor(req.user.id, password);

    logger.info(`2FA disabled for: ${req.user.email}`);

    return ApiResponse.success(res, '2FA disabled successfully');
  } catch (error) {
    logger.error('Disable 2FA error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, 'Failed to disable 2FA', [error.message]);
  }
};

/**
 * @desc    Verify 2FA code during login
 * @route   POST /api/v1/auth/2fa/login
 * @access  Public
 */
export const verifyTwoFactorLogin = async (req, res) => {
  try {
    const { userId, token } = req.body;

    await authService.verifyTwoFactorLogin(userId, token);

    // Complete login
    const user = await db.User.findByPk(userId, {
      include: [
        { model: db.Role, as: 'role' },
        { model: db.Business, as: 'business' },
        { model: db.Branch, as: 'branch' },
      ],
    });

    // Generate tokens
    const tokens = generateTokenPair({
      id: user.id,
      email: user.email,
      businessId: user.businessId,
      roleId: user.roleId,
    });

    await user.update({
      refreshToken: tokens.refreshToken,
      lastLoginAt: new Date(),
    });

    logger.info(`2FA login successful for: ${user.email}`);

    return ApiResponse.success(res, '2FA verification successful', {
      user: user.toSafeObject(),
      role: user.role,
      business: user.business,
      branch: user.branch,
      tokens,
    });
  } catch (error) {
    logger.error('2FA login error:', error);

    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return ApiResponse.internal(res, '2FA verification failed', [error.message]);
  }
};
