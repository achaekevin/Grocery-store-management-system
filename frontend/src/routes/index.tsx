import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@layouts/DashboardLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { POSLayout } from '@layouts/POSLayout';
import { CustomerLayout } from '@layouts/CustomerLayout';

// Auth Pages
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@pages/auth/ForgotPasswordPage';
import { LandingPage } from '@pages/public/LandingPage';

// Management Dashboard Pages
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { ProductsPage } from '@pages/products/ProductsPage';
import { CustomersPage } from '@pages/customers/CustomersPage';
import { SuppliersPage } from '@pages/suppliers/SuppliersPage';
import { BranchesPage } from '@pages/branches/BranchesPage';
import { SettingsPage } from '@pages/settings/SettingsPage';
import { ProfilePage } from '@pages/settings/ProfilePage';
import { SalesPage } from '@pages/sales/SalesPage';
import { ExpensesPage } from '@pages/expenses/ExpensesPage';
import { ReportsPage } from '@pages/reports/ReportsPage';
import { AnalyticsPage } from '@pages/analytics/AnalyticsPage';
import { UsersPage } from '@pages/users/UsersPage';
import { InventoryPage } from '@pages/inventory/InventoryPage';
import { AuditLogsPage } from '@pages/audit/AuditLogsPage';

// Customer Portal Pages
import { CustomerDashboardPage } from '@pages/customer/CustomerDashboardPage';
import { CustomerShopPage } from '@pages/customer/CustomerShopPage';
import { CustomerCartPage } from '@pages/customer/CustomerCartPage';
import { CustomerCheckoutPage } from '@pages/customer/CustomerCheckoutPage';
import { CustomerOrdersPage } from '@pages/customer/CustomerOrdersPage';
import { CustomerLoyaltyPage } from '@pages/customer/CustomerLoyaltyPage';
import { CustomerWishlistPage } from '@pages/customer/CustomerWishlistPage';
import { CustomerOffersPage } from '@pages/customer/CustomerOffersPage';
import { CustomerStoresPage } from '@pages/customer/CustomerStoresPage';
import { CustomerProfilePage } from '@pages/customer/CustomerProfilePage';
import { CustomerSupportPage } from '@pages/customer/CustomerSupportPage';

// POS Pages
import { POSPage } from '@pages/pos/POSPage';

// Protected Route Wrapper
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <Navigate to="/auth/login" replace />,
  },

  // ================= DEDICATED CUSTOMER PORTAL =================
  {
    path: '/customer',
    element: (
      <ProtectedRoute portalType="customer">
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/customer/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <CustomerDashboardPage />,
      },
      {
        path: 'shop',
        element: <CustomerShopPage />,
      },
      {
        path: 'cart',
        element: <CustomerCartPage />,
      },
      {
        path: 'checkout',
        element: <CustomerCheckoutPage />,
      },
      {
        path: 'orders',
        element: <CustomerOrdersPage />,
      },
      {
        path: 'loyalty',
        element: <CustomerLoyaltyPage />,
      },
      {
        path: 'wishlist',
        element: <CustomerWishlistPage />,
      },
      {
        path: 'offers',
        element: <CustomerOffersPage />,
      },
      {
        path: 'stores',
        element: <CustomerStoresPage />,
      },
      {
        path: 'profile',
        element: <CustomerProfilePage />,
      },
      {
        path: 'support',
        element: <CustomerSupportPage />,
      },
    ],
  },

  // ================= MANAGEMENT PORTAL =================
  {
    path: '/',
    element: (
      <ProtectedRoute portalType="management">
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'customers',
        element: <CustomersPage />,
      },
      {
        path: 'suppliers',
        element: <SuppliersPage />,
      },
      {
        path: 'branches',
        element: <BranchesPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'sales',
        element: <SalesPage />,
      },
      {
        path: 'expenses',
        element: <ExpensesPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
      {
        path: 'inventory',
        element: <InventoryPage />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogsPage />,
      },
    ],
  },
  {
    path: '/pos',
    element: (
      <ProtectedRoute portalType="management">
        <POSLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <POSPage />,
      },
    ],
  },
]);
