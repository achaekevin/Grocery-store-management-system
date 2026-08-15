import { requirePermission } from './rbac.js';

export const checkPermission = (permissionName, action) => {
  if (action) {
    return requirePermission(`${permissionName}:${action}`);
  }
  return requirePermission(permissionName);
};

export default checkPermission;
