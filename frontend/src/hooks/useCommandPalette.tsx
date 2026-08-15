import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Package,
  Users,
  Building2,
  ShoppingCart,
  Receipt,
  BarChart3,
  Settings,
  Plus,
  FileText,
  Grid3x3,
  User,
  Warehouse,
  TrendingUp,
  Banknote,
  LogOut,
  Bell,
  Search,
} from 'lucide-react';
import { Command, CommandCategory } from '@/types/command.types';

export const useCommandPalette = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Define all available commands
  const allCommands: Command[] = useMemo(() => [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'Navigate to main dashboard',
      category: 'navigation',
      icon: <Home className="w-4 h-4" />,
      keywords: ['home', 'main', 'overview'],
      action: () => navigate('/dashboard'),
      shortcut: 'Ctrl+H',
    },
    {
      id: 'nav-products',
      label: 'Go to Products',
      description: 'View all products',
      category: 'navigation',
      icon: <Package className="w-4 h-4" />,
      keywords: ['inventory', 'items', 'stock'],
      action: () => navigate('/products'),
      shortcut: 'Ctrl+P',
    },
    {
      id: 'nav-customers',
      label: 'Go to Customers',
      description: 'Manage customers',
      category: 'navigation',
      icon: <Users className="w-4 h-4" />,
      keywords: ['clients', 'buyers'],
      action: () => navigate('/customers'),
      shortcut: 'Ctrl+U',
    },
    {
      id: 'nav-suppliers',
      label: 'Go to Suppliers',
      description: 'Manage suppliers',
      category: 'navigation',
      icon: <Building2 className="w-4 h-4" />,
      keywords: ['vendors', 'providers'],
      action: () => navigate('/suppliers'),
    },
    {
      id: 'nav-orders',
      label: 'Go to Orders',
      description: 'View all orders',
      category: 'navigation',
      icon: <ShoppingCart className="w-4 h-4" />,
      keywords: ['sales', 'purchases'],
      action: () => navigate('/orders'),
    },
    {
      id: 'nav-inventory',
      label: 'Go to Inventory',
      description: 'Manage inventory',
      category: 'navigation',
      icon: <Warehouse className="w-4 h-4" />,
      keywords: ['stock', 'warehouse'],
      action: () => navigate('/inventory'),
      shortcut: 'Ctrl+I',
    },
    {
      id: 'nav-pos',
      label: 'Open POS',
      description: 'Point of Sale terminal',
      category: 'navigation',
      icon: <Receipt className="w-4 h-4" />,
      keywords: ['cashier', 'checkout', 'till'],
      action: () => navigate('/pos'),
      shortcut: 'Ctrl+Shift+P',
    },
    {
      id: 'nav-reports',
      label: 'Go to Reports',
      description: 'View reports and analytics',
      category: 'navigation',
      icon: <BarChart3 className="w-4 h-4" />,
      keywords: ['analytics', 'statistics', 'insights'],
      action: () => navigate('/reports'),
      shortcut: 'Ctrl+R',
    },
    {
      id: 'nav-branches',
      label: 'Go to Branches',
      description: 'Manage branches',
      category: 'branch',
      icon: <Building2 className="w-4 h-4" />,
      keywords: ['locations', 'stores'],
      action: () => navigate('/branches'),
      shortcut: 'Ctrl+B',
    },
    {
      id: 'nav-settings',
      label: 'Go to Settings',
      description: 'Configure system settings',
      category: 'settings',
      icon: <Settings className="w-4 h-4" />,
      keywords: ['preferences', 'configuration'],
      action: () => navigate('/settings'),
    },

    // Create Commands
    {
      id: 'create-product',
      label: 'Create New Product',
      description: 'Add a new product to inventory',
      category: 'create',
      icon: <Plus className="w-4 h-4" />,
      keywords: ['add product', 'new item'],
      action: () => navigate('/products/new'),
      shortcut: 'Ctrl+Shift+N',
    },
    {
      id: 'create-customer',
      label: 'Create New Customer',
      description: 'Register a new customer',
      category: 'create',
      icon: <Plus className="w-4 h-4" />,
      keywords: ['add customer', 'new client'],
      action: () => navigate('/customers/new'),
    },
    {
      id: 'create-supplier',
      label: 'Create New Supplier',
      description: 'Add a new supplier',
      category: 'create',
      icon: <Plus className="w-4 h-4" />,
      keywords: ['add supplier', 'new vendor'],
      action: () => navigate('/suppliers/new'),
    },
    {
      id: 'create-order',
      label: 'Create New Order',
      description: 'Start a new order',
      category: 'create',
      icon: <Plus className="w-4 h-4" />,
      keywords: ['new sale', 'add order'],
      action: () => navigate('/orders/new'),
      shortcut: 'Ctrl+N',
    },
    {
      id: 'create-invoice',
      label: 'Create Invoice',
      description: 'Generate a new invoice',
      category: 'create',
      icon: <FileText className="w-4 h-4" />,
      keywords: ['bill', 'receipt'],
      action: () => navigate('/invoices/new'),
    },
    {
      id: 'create-category',
      label: 'Create Category',
      description: 'Add a new product category',
      category: 'create',
      icon: <Grid3x3 className="w-4 h-4" />,
      keywords: ['add category'],
      action: () => navigate('/categories/new'),
    },
    {
      id: 'create-user',
      label: 'Create User',
      description: 'Add a new user account',
      category: 'create',
      icon: <User className="w-4 h-4" />,
      keywords: ['add user', 'new employee'],
      action: () => navigate('/users/new'),
    },
    {
      id: 'create-branch',
      label: 'Create Branch',
      description: 'Add a new branch location',
      category: 'branch',
      icon: <Building2 className="w-4 h-4" />,
      keywords: ['add branch', 'new location'],
      action: () => navigate('/branches/new'),
    },

    // Action Commands
    {
      id: 'action-search',
      label: 'Global Search',
      description: 'Search everything',
      category: 'search',
      icon: <Search className="w-4 h-4" />,
      keywords: ['find', 'lookup'],
      action: () => {
        setIsOpen(false);
        // Trigger global search
        setTimeout(() => {
          const event = new KeyboardEvent('keydown', { 
            key: 'k', 
            ctrlKey: true 
          });
          window.dispatchEvent(event);
        }, 100);
      },
      shortcut: 'Ctrl+K',
    },
    {
      id: 'action-notifications',
      label: 'View Notifications',
      description: 'Open notification center',
      category: 'actions',
      icon: <Bell className="w-4 h-4" />,
      keywords: ['alerts', 'messages'],
      action: () => navigate('/notifications'),
    },

    // Report Commands
    {
      id: 'report-sales',
      label: 'Sales Report',
      description: 'View sales analytics',
      category: 'reports',
      icon: <TrendingUp className="w-4 h-4" />,
      keywords: ['revenue', 'income'],
      action: () => navigate('/reports/sales'),
    },
    {
      id: 'report-inventory',
      label: 'Inventory Report',
      description: 'View inventory status',
      category: 'reports',
      icon: <Warehouse className="w-4 h-4" />,
      keywords: ['stock report'],
      action: () => navigate('/reports/inventory'),
    },
    {
      id: 'report-financial',
      label: 'Financial Report',
      description: 'View financial summary',
      category: 'reports',
      icon: <Banknote className="w-4 h-4" />,
      keywords: ['profit', 'expenses'],
      action: () => navigate('/reports/financial'),
    },

    // Settings Commands
    {
      id: 'settings-profile',
      label: 'My Profile',
      description: 'Edit your profile',
      category: 'settings',
      icon: <User className="w-4 h-4" />,
      keywords: ['account', 'user settings'],
      action: () => navigate('/profile'),
    },
    {
      id: 'settings-theme',
      label: 'Change Theme',
      description: 'Switch between light and dark mode',
      category: 'settings',
      icon: <Settings className="w-4 h-4" />,
      keywords: ['appearance', 'dark mode', 'light mode'],
      action: () => navigate('/settings/theme'),
    },
    {
      id: 'action-logout',
      label: 'Logout',
      description: 'Sign out of your account',
      category: 'actions',
      icon: <LogOut className="w-4 h-4" />,
      keywords: ['sign out', 'exit'],
      action: () => {
        localStorage.clear();
        navigate('/login');
      },
    },
  ], [navigate]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query) return allCommands;

    const lowerQuery = query.toLowerCase();
    return allCommands.filter((command) => {
      const labelMatch = command.label.toLowerCase().includes(lowerQuery);
      const descMatch = command.description?.toLowerCase().includes(lowerQuery);
      const keywordMatch = command.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(lowerQuery)
      );
      return labelMatch || descMatch || keywordMatch;
    });
  }, [query, allCommands]);

  // Group commands by category
  const groupedCommands = useMemo(() => {
    const groups: Record<CommandCategory, Command[]> = {
      navigation: [],
      actions: [],
      search: [],
      create: [],
      settings: [],
      reports: [],
      branch: [],
    };

    filteredCommands.forEach((command) => {
      groups[command.category].push(command);
    });

    return Object.entries(groups)
      .filter(([_, commands]) => commands.length > 0)
      .map(([category, commands]) => ({
        title: category.charAt(0).toUpperCase() + category.slice(1),
        commands,
      }));
  }, [filteredCommands]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const executeCommand = useCallback((command: Command) => {
    command.action();
    close();
  }, [close]);

  return {
    isOpen,
    open,
    close,
    toggle,
    query,
    setQuery,
    groupedCommands,
    filteredCommands,
    executeCommand,
    allCommands,
  };
};
