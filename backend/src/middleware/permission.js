import { requirePermission } from './rbac.js';

/**
 * Check permission middleware
 * Alias for requirePermission for backwards compatibility
 */
export const checkPermission = (permissionName) => {
  // Parse permission name in format "module.action"
  const [module, action] = permissionName.split('.');
  return requirePermission(module, action);
};

export default checkPermission;
