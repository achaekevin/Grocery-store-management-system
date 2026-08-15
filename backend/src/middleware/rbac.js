import ApiError from '../utils/ApiError.js';

/**
 * Role permissions dictionary for seamless fallback when explicit DB permissions are unpopulated
 */
const DEFAULT_ROLE_PERMISSIONS = {
  'Super Admin': ['*'],
  'Admin': ['*'],
  'Branch Manager': ['*'],
  'Manager': ['*'],
  'Inventory Clerk': [
    'suppliers:*',
    'suppliers:read',
    'suppliers:create',
    'suppliers:update',
    'products:*',
    'products:read',
    'inventory:*',
    'inventory:read',
    'purchase-orders:*',
    'stock-transfers:*',
    'reports:read',
    'dashboard:read',
  ],
  'Cashier': [
    'pos:*',
    'sales:*',
    'products:read',
    'customers:*',
    'customers:read',
    'customers:create',
    'mpesa:*',
    'suppliers:read',
    'dashboard:read',
  ],
  'Accountant': [
    'financial:*',
    'reports:*',
    'sales:read',
    'suppliers:read',
    'customers:read',
    'dashboard:read',
  ],
  'Customer': [
    'customer:*',
    'products:read',
  ],
};

/**
 * Check if user has required role
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw ApiError.unauthorized('Authentication required');
      }

      const userRole = typeof req.user.role === 'object' ? req.user.role?.name : req.user.role;

      if (!userRole) {
        throw ApiError.forbidden('User has no role assigned');
      }

      // Super Admin and Admin have access to everything
      if (userRole === 'Super Admin' || userRole === 'Admin') {
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

      const userRole = typeof req.user.role === 'object' ? req.user.role?.name : req.user.role;

      // Super Admin, Admin, Branch Manager, and Manager have access to all modules
      if (
        userRole === 'Super Admin' ||
        userRole === 'Admin' ||
        userRole === 'Branch Manager' ||
        userRole === 'Manager'
      ) {
        return next();
      }

      const permissions = req.user.role?.permissions || [];
      const normalizedPermission = permissionString.replace(':', '.');

      // 1. Check explicit permissions in user role
      const hasExplicitPermission = permissions.some(
        (p) => p.name === normalizedPermission || p.name === permissionString || p.name === '*'
      );

      if (hasExplicitPermission) {
        return next();
      }

      // 2. Check default role permissions mapping
      const roleDefaults = DEFAULT_ROLE_PERMISSIONS[userRole] || [];
      const [module, action] = permissionString.split(/[:.]/);

      const hasDefaultPermission = roleDefaults.some(
        (perm) =>
          perm === '*' ||
          perm === permissionString ||
          perm === `${module}:*` ||
          perm === `${module}.${action}`
      );

      if (hasDefaultPermission) {
        return next();
      }

      throw ApiError.forbidden(
        `You don't have permission to ${action || 'access'} ${module || permissionString}`
      );
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

    if (req.params.tenantId && req.params.tenantId !== userTenantId) {
      throw ApiError.forbidden('Access denied to this tenant');
    }

    if (req.body.tenantId && req.body.tenantId !== userTenantId) {
      throw ApiError.forbidden('Access denied to this tenant');
    }

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

    const userRole = typeof req.user.role === 'object' ? req.user.role?.name : req.user.role;

    if (['Super Admin', 'Admin', 'Branch Manager', 'Manager'].includes(userRole)) {
      return next();
    }

    const userBranchId = req.user.branchId;
    const requestedBranchId = req.params.branchId || req.body.branchId || req.query.branchId;

    if (requestedBranchId && userBranchId && requestedBranchId !== userBranchId) {
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
