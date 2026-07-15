import ApiError from '../utils/ApiError.js';

/**
 * Check if user has required role
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const userRole = req.user.role?.name;

      if (!userRole) {
        throw ApiError.forbidden('User has no role assigned');
      }

      // Super Admin has access to everything
      if (userRole === 'Super Admin') {
        return next();
      }

      if (!allowedRoles.includes(userRole)) {
        throw ApiError.forbidden('Insufficient permissions');
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        errors: [error.message],
      });
    }
  };
};

/**
 * Check if user has required permission
 */
export const requirePermission = (module, action) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const userRole = req.user.role?.name;

      // Super Admin has all permissions
      if (userRole === 'Super Admin') {
        return next();
      }

      const permissions = req.user.role?.permissions || [];
      const permissionName = `${module}.${action}`;

      const hasPermission = permissions.some(
        (p) => p.name === permissionName
      );

      if (!hasPermission) {
        throw ApiError.forbidden(
          `You don't have permission to ${action} ${module}`
        );
      }

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
          errors: error.errors,
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Permission check failed',
        errors: [error.message],
      });
    }
  };
};

/**
 * Check if user belongs to the same business (Multi-tenant isolation)
 */
export const requireSameBusiness = (req, res, next) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const userBusinessId = req.user.businessId;

    // Check in params
    if (req.params.businessId && parseInt(req.params.businessId) !== userBusinessId) {
      throw ApiError.forbidden('Access denied to this business');
    }

    // Check in body
    if (req.body.businessId && parseInt(req.body.businessId) !== userBusinessId) {
      throw ApiError.forbidden('Access denied to this business');
    }

    // Check in query
    if (req.query.businessId && parseInt(req.query.businessId) !== userBusinessId) {
      throw ApiError.forbidden('Access denied to this business');
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Business check failed',
      errors: [error.message],
    });
  }
};

/**
 * Check if user has access to specific branch
 */
export const requireBranchAccess = (req, res, next) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const userRole = req.user.role?.name;

    // Super Admin and Branch Manager have access to all branches in their business
    if (['Super Admin', 'Branch Manager'].includes(userRole)) {
      return next();
    }

    const userBranchId = req.user.branchId;
    const requestedBranchId = req.params.branchId || req.body.branchId || req.query.branchId;

    if (requestedBranchId && parseInt(requestedBranchId) !== userBranchId) {
      throw ApiError.forbidden('Access denied to this branch');
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Branch access check failed',
      errors: [error.message],
    });
  }
};

export default {
  requireRole,
  requirePermission,
  requireSameBusiness,
  requireBranchAccess,
};
