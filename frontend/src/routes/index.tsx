import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@layouts/DashboardLayout';
import { AuthLayout } from '@layouts/AuthLayout';
import { POSLayout } from '@layouts/POSLayout';

// Auth Pages
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@pages/auth/ForgotPasswordPage';
import { LandingPage } from '@pages/public/LandingPage';

// Dashboard Pages
import { DashboardPage } from '@pages/dashboard/DashboardPage';
import { ProductsPage } from '@pages/products/ProductsPage';
import { CustomersPage } from '@pages/customers/CustomersPage';
import { SuppliersPage } from '@pages/suppliers/SuppliersPage';
import { BranchesPage } from '@pages/branches/BranchesPage';
import { SettingsPage } from '@pages/settings/SettingsPage';
import { ProfilePage } from '@pages/settings/ProfilePage';

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
  {
    path: '/',
    element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
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
    ],
  },
  {
    path: '/pos',
    element: <ProtectedRoute><POSLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <POSPage />,
      },
    ],
  },
]);
