import { verifyToken } from '../helpers/jwt.js';
import ApiError from '../utils/ApiError.js';
import db from '../models/index.js';

/**
 * Authenticate user from JWT token
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Get user from database
    const user = await db.User.findByPk(decoded.id, {
      include: [
        {
          model: db.Role,
          as: 'role',
          include: [
            {
              model: db.Permission,
              as: 'permissions',
            },
          ],
        },
        {
          model: db.Business,
          as: 'business',
        },
        {
          model: db.Branch,
          as: 'branch',
        },
      ],
    });

    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    if (user.status !== 'active') {
      throw ApiError.unauthorized('User account is not active');
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt && decoded.iat) {
      const passwordChangedTimestamp = Math.floor(
        user.passwordChangedAt.getTime() / 1000
      );

      if (decoded.iat < passwordChangedTimestamp) {
        throw ApiError.unauthorized('Password was recently changed. Please log in again');
      }
    }

    // Attach user to request
    req.user = user.toSafeObject();
    req.user.role = user.role;
    req.user.business = user.business;
    req.user.branch = user.branch;

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      errors: [error.message],
    });
  }
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      await authenticate(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

export default {
  authenticate,
  optionalAuth,
};
