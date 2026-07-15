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
    // TODO: Implement forgot password logic
    // 1. Generate reset token
    // 2. Send email with reset link
    // 3. Store token in database

    return ApiResponse.success(
      res,
      'Password reset instructions sent to your email'
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
    // TODO: Implement reset password logic
    // 1. Verify reset token
    // 2. Update password
    // 3. Invalidate reset token

    return ApiResponse.success(res, 'Password reset successful');
  } catch (error) {
    logger.error('Reset password error:', error);
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
