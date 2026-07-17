import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import { Notification, NotificationFilters } from '@/types/notification.types';

export const useNotifications = (filters?: NotificationFilters) => {
  const queryClient = useQueryClient();
  const [localNotifications, setLocalNotifications] = useState<Notification[]>([]);

  // Fetch notifications
  const { data: notifications = [], isLoading, error, refetch } = useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => notificationService.getNotifications(filters),
    staleTime: 1000 * 30, // 30 seconds
  });

  // Get unread count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationService.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Get stats
  const { data: stats } = useQuery({
    queryKey: ['notifications', 'stats'],
    queryFn: () => notificationService.getStats(),
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Clear all notifications mutation
  const clearAllMutation = useMutation({
    mutationFn: () => notificationService.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Subscribe to real-time notifications
  useEffect(() => {
    const unsubscribe = notificationService.subscribeToNotifications((notification) => {
      // Add to local state for immediate display
      setLocalNotifications((prev) => [notification, ...prev]);
      
      // Play notification sound (optional)
      playNotificationSound();
      
      // Show browser notification (if permitted)
      showBrowserNotification(notification);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    return unsubscribe;
  }, [queryClient]);

  const playNotificationSound = () => {
    // Optional: play a sound for new notifications
    try {
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors (e.g., autoplay policy)
      });
    } catch (error) {
      // Ignore
    }
  };

  const showBrowserNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png',
      });
    }
  };

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  // Combine server and local notifications
  const allNotifications = [...localNotifications, ...notifications];

  return {
    notifications: allNotifications,
    unreadCount,
    stats,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    clearAll: clearAllMutation.mutate,
    refetch,
    requestNotificationPermission,
  };
};
