import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@utils/cn';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  BarChart3,
  ShoppingBag,
  Users,
  Gift,
  Truck,
  DollarSign,
  CreditCard,
  Smartphone,
  Building2,
  FileText,
  Bell,
  Settings,
  UserCog,
  Shield,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  roles?: string[];
}

const navigationItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    path: '/dashboard',
  },
  {
    label: 'Point of Sale',
    icon: <ShoppingCart className="h-5 w-5" />,
    path: '/pos',
    roles: ['Super Admin', 'Branch Manager', 'Cashier'],
  },
  {
    label: 'Products',
    icon: <Package className="h-5 w-5" />,
    path: '/products',
  },
  {
    label: 'Inventory',
    icon: <Warehouse className="h-5 w-5" />,
    path: '/inventory',
  },
  {
    label: 'Barcodes',
    icon: <BarChart3 className="h-5 w-5" />,
    path: '/barcodes',
  },
  {
    label: 'Sales',
    icon: <ShoppingBag className="h-5 w-5" />,
    path: '/sales',
  },
  {
    label: 'Purchases',
    icon: <FileText className="h-5 w-5" />,
    path: '/purchases',
  },
  {
    label: 'Customers',
    icon: <Users className="h-5 w-5" />,
    path: '/customers',
  },
  {
    label: 'Loyalty',
    icon: <Gift className="h-5 w-5" />,
    path: '/loyalty',
  },
  {
    label: 'Suppliers',
    icon: <Truck className="h-5 w-5" />,
    path: '/suppliers',
  },
  {
    label: 'Finance',
    icon: <DollarSign className="h-5 w-5" />,
    path: '/finance',
  },
  {
    label: 'Expenses',
    icon: <CreditCard className="h-5 w-5" />,
    path: '/expenses',
  },
  {
    label: 'M-Pesa',
    icon: <Smartphone className="h-5 w-5" />,
    path: '/mpesa',
  },
  {
    label: 'Branches',
    icon: <Building2 className="h-5 w-5" />,
    path: '/branches',
    roles: ['Super Admin'],
  },
  {
    label: 'Reports',
    icon: <FileText className="h-5 w-5" />,
    path: '/reports',
  },
  {
    label: 'Users & Roles',
    icon: <UserCog className="h-5 w-5" />,
    path: '/users',
    roles: ['Super Admin', 'Branch Manager'],
  },
  {
    label: 'Audit Logs',
    icon: <Shield className="h-5 w-5" />,
    path: '/audit-logs',
    roles: ['Super Admin'],
  },
  {
    label: 'Settings',
    icon: <Settings className="h-5 w-5" />,
    path: '/settings',
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const hasAccess = (item: NavItem) => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary font-bold text-white">
              G
            </div>
            <span className="text-lg font-bold">GroceryOS</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        <div className="space-y-1">
          {navigationItems.filter(hasAccess).map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};
