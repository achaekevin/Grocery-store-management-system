import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { CommandPalette } from '@/components/command/CommandPalette';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useNotifications } from '@/hooks/useNotifications';
import { Bell, Search, Command } from 'lucide-react';
import { cn } from '@/utils/cn';

export const MainLayout: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { unreadCount, requestNotificationPermission } = useNotifications();

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Global keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      action: () => {
        setShowSearch(false);
        setShowCommandPalette((prev) => !prev);
      },
      description: 'Open command palette',
    },
    {
      key: '/',
      ctrl: true,
      action: () => {
        setShowCommandPalette(false);
        setShowSearch((prev) => !prev);
      },
      description: 'Open global search',
    },
    {
      key: 'n',
      ctrl: true,
      shift: true,
      action: () => setShowNotifications((prev) => !prev),
      description: 'Open notifications',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  GroceryOS
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Grocery Management System
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
                <kbd className="hidden lg:inline-flex px-2 py-0.5 text-xs font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                  Ctrl+/
                </kbd>
              </button>

              {/* Command Palette Button */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Command Palette (Ctrl+K)"
              >
                <Command className="w-5 h-5" />
              </button>

              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Search Modal */}
      <GlobalSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
};
