import React from 'react';
import { Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-lg">
              G
            </div>
            <h1 className="text-3xl font-bold">GroceryOS</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Multi-Branch SaaS Management System
            </p>
          </div>

          {/* Auth Content */}
          <div className="rounded-xl border bg-card shadow-xl">
            <Outlet />
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            © 2025 GroceryOS. Built for Kenyan multi-branch retail.
          </p>
        </div>
      </div>
    </div>
  );
};
