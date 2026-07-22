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
export const requirePermission = (permissionString) => {
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
      
      // Support both 'module:action' and 'module.action' formats
      const normalizedPermission = permissionString.replace(':', '.');

      const hasPermission = permissions.some(
        (p) => p.name === normalizedPermission || p.name === permissionString
      );

      if (!hasPermission) {
        const [module, action] = permissionString.split(/[:.]/);
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
 * Check if user belongs to the same tenant (Multi-tenant isolation)
 */
export const requireSameTenant = (req, res, next) => {
  try {
    if (!req.user) {
      throw ApiError.unauthorized('Authentication required');
    }

    const userTenantId = req.user.tenantId;

    // Check in params
    if (req.params.tenantId && req.params.tenantId !== userTenantId) {
      throw ApiError.forbidden('Access denied to this tenant');
    }

    // Check in body
    if (req.body.tenantId && req.body.tenantId !== userTenantId) {
      throw ApiError.forbidden('Access denied to this tenant');
    }

    // Check in query
    if (req.query.tenantId && req.query.tenantId !== userTenantId) {
      throw ApiError.forbidden('Access denied to this tenant');
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
      message: 'Tenant check failed',
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
  requireSameTenant,
  requireBranchAccess,
};
