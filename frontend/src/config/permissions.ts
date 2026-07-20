// Role-based permissions configuration
export type RoleName = 'Super Admin' | 'Manager' | 'Cashier' | 'Inventory Clerk' | 'Accountant';

export interface Permission {
  module: string;
  actions: {
    create?: boolean;
    read?: boolean;
    update?: boolean;
    delete?: boolean;
  };
}

// Define what each role can access
export const ROLE_PERMISSIONS: Record<RoleName, string[]> = {
  'Super Admin': [
    'dashboard',
    'pos',
    'products',
    'inventory',
    'customers',
    'suppliers',
    'branches',
    'users',
    'roles',
    'sales',
    'reports',
    'expenses',
    'settings',
    'analytics',
  ],
  'Manager': [
    'dashboard',
    'pos',
    'products',
    'inventory',
    'customers',
    'suppliers',
    'sales',
    'reports',
    'expenses',
    'analytics',
  ],
  'Cashier': [
    'pos',
    'customers',
    'sales',
  ],
  'Inventory Clerk': [
    'dashboard',
    'products',
    'inventory',
    'suppliers',
  ],
  'Accountant': [
    'dashboard',
    'sales',
    'reports',
    'expenses',
    'analytics',
  ],
};

// Check if a user has permission to access a module
export const hasPermission = (userRole: string | undefined, module: string): boolean => {
  if (!userRole) return false;
  
  const permissions = ROLE_PERMISSIONS[userRole as RoleName];
  if (!permissions) return false;
  
  return permissions.includes(module);
};

// Check if user has admin privileges
export const isAdmin = (userRole: string | undefined): boolean => {
  return userRole === 'Super Admin';
};

// Check if user has manager privileges
export const isManager = (userRole: string | undefined): boolean => {
  return userRole === 'Manager' || userRole === 'Super Admin';
};
