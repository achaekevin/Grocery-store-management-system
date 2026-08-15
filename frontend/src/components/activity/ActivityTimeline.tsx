import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LogIn,
  LogOut,
  Package,
  ShoppingCart,
  ArrowRightLeft,
  Building2,
  UserPlus,
  Banknote,
  Warehouse,
  Settings,
  Trash2,
  Edit,
  Filter,
  Clock,
  User,
} from 'lucide-react';
import { useActivityTimeline } from '@/hooks/useActivityTimeline';
import { Activity, ActivityType } from '@/types/activity.types';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/utils/cn';

interface ActivityTimelineProps {
  filters?: any;
  limit?: number;
  showFilters?: boolean;
}

const activityIcons: Record<ActivityType, React.ReactNode> = {
  user_login: <LogIn className="w-4 h-4" />,
  user_logout: <LogOut className="w-4 h-4" />,
  product_added: <Package className="w-4 h-4" />,
  product_updated: <Edit className="w-4 h-4" />,
  product_deleted: <Trash2 className="w-4 h-4" />,
  sale_completed: <ShoppingCart className="w-4 h-4" />,
  order_created: <ShoppingCart className="w-4 h-4" />,
  order_updated: <Edit className="w-4 h-4" />,
  stock_transferred: <ArrowRightLeft className="w-4 h-4" />,
  branch_created: <Building2 className="w-4 h-4" />,
  customer_registered: <UserPlus className="w-4 h-4" />,
  supplier_added: <Building2 className="w-4 h-4" />,
  payment_received: <Banknote className="w-4 h-4" />,
  inventory_adjusted: <Warehouse className="w-4 h-4" />,
  user_created: <UserPlus className="w-4 h-4" />,
  settings_changed: <Settings className="w-4 h-4" />,
};

const activityColors: Record<ActivityType, string> = {
  user_login: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  user_logout: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  product_added: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  product_updated: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  product_deleted: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  sale_completed: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  order_created: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  order_updated: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  stock_transferred: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  branch_created: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  customer_registered: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  supplier_added: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  payment_received: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  inventory_adjusted: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  user_created: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  settings_changed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  filters,
  limit,
  showFilters = false,
}) => {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const { activities, isLoading, stats } = useActivityTimeline(filters);

  const displayActivities = limit ? activities.slice(0, limit) : activities;

  const groupActivitiesByDate = (activities: Activity[]) => {
    const groups: Record<string, Activity[]> = {};
    
    activities.forEach((activity) => {
      const date = format(new Date(activity.timestamp), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });

    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const groupedActivities = groupActivitiesByDate(displayActivities);

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      {showFilters && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Activity Timeline
            </h3>
            {stats && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                {stats.total} activities
              </span>
            )}
          </div>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500">Filter options will be implemented here</p>
        </div>
      )}

      {/* Timeline */}
      {displayActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mb-3 opacity-50" />
          <p className="text-sm">No activities found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedActivities.map(([date, dateActivities]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {getDateLabel(date)}
                </span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Activities */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[21px] top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-4">
                  {dateActivities.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative pl-12"
                    >
                      {/* Icon */}
                      <div className={cn(
                        'absolute left-0 flex items-center justify-center w-11 h-11 rounded-full ring-4 ring-white dark:ring-gray-800',
                        activityColors[activity.type]
                      )}>
                        {activityIcons[activity.type]}
                      </div>

                      {/* Content */}
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              {activity.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {activity.description}
                            </p>
                            
                            {/* Metadata */}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{activity.userName}</span>
                              </div>
                              {activity.branchName && (
                                <div className="flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>{activity.branchName}</span>
                                </div>
                              )}
                              <span>
                                {formatDistanceToNow(new Date(activity.timestamp), { 
                                  addSuffix: true 
                                })}
                              </span>
                            </div>

                            {/* Changes */}
                            {activity.changes && activity.changes.length > 0 && (
                              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900 rounded text-xs">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                  Changes:
                                </span>
                                <ul className="mt-1 space-y-1">
                                  {activity.changes.map((change, idx) => (
                                    <li key={idx} className="text-gray-600 dark:text-gray-400">
                                      <span className="font-medium">{change.field}:</span>{' '}
                                      <span className="line-through">{change.oldValue}</span>
                                      {' → '}
                                      <span className="text-green-600 dark:text-green-400">
                                        {change.newValue}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* User Avatar */}
                          {activity.userAvatar ? (
                            <img
                              src={activity.userAvatar}
                              alt={activity.userName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {limit && activities.length > limit && (
        <div className="text-center">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Load more activities
          </button>
        </div>
      )}
    </div>
  );
};
