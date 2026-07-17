import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  X,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Package,
  ShoppingCart,
  CreditCard,
  XCircle,
  Calendar,
  Settings,
  Loader2,
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { Notification, NotificationType, NotificationPriority } from '@/types/notification.types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  low_stock: <Package className="w-4 h-4" />,
  new_order: <ShoppingCart className="w-4 h-4" />,
  mpesa_payment: <CreditCard className="w-4 h-4" />,
  failed_transaction: <XCircle className="w-4 h-4" />,
  expiring_product: <Calendar className="w-4 h-4" />,
  system_update: <Settings className="w-4 h-4" />,
  user_action: <Info className="w-4 h-4" />,
  warning: <AlertTriangle className="w-4 h-4" />,
  success: <CheckCircle className="w-4 h-4" />,
  error: <AlertCircle className="w-4 h-4" />,
  info: <Info className="w-4 h-4" />,
};

const notificationColors: Record<NotificationType, string> = {
  low_stock: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  new_order: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  mpesa_payment: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  failed_transaction: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  expiring_product: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  system_update: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  user_action: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  warning: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  error: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
};

const priorityBadges: Record<NotificationPriority, string> = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filterRead, setFilterRead] = useState<boolean | undefined>(undefined);
  
  const {
    notifications,
    unreadCount,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications({ read: filterRead });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      onClose();
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 lg:relative lg:inset-auto"
      >
        {/* Backdrop (mobile only) */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl lg:absolute lg:right-0 lg:top-12 lg:w-96 lg:h-auto lg:max-h-[600px] lg:rounded-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors',
                showFilters
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => clearAll()}
                className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors ml-auto"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterRead(undefined)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg transition-colors',
                      filterRead === undefined
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterRead(false)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg transition-colors',
                      filterRead === false
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setFilterRead(true)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg transition-colors',
                      filterRead === true
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    )}
                  >
                    Read
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mb-3 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className={cn(
                      'p-4 cursor-pointer transition-colors relative',
                      notification.read
                        ? 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        : 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {!notification.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                    
                    <div className="flex items-start gap-3 ml-3">
                      <div className={cn(
                        'flex items-center justify-center w-10 h-10 rounded-lg shrink-0',
                        notificationColors[notification.type]
                      )}>
                        {notificationIcons[notification.type]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </h4>
                          <span className={cn(
                            'px-2 py-0.5 text-xs rounded-full shrink-0',
                            priorityBadges[notification.priority]
                          )}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                          {notification.actionLabel && (
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              {notification.actionLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <button
                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(e, notification.id)}
                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {stats && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{stats.total} total</span>
                <span>{stats.unread} unread</span>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
