import apiService from './api';
import { Notification, NotificationFilters, NotificationStats } from '@/types/notification.types';

class NotificationService {
  private readonly baseUrl = '/notifications';

  async getNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    return apiService.get<Notification[]>(this.baseUrl, { params: filters });
  }

  async getUnreadCount(): Promise<number> {
    const response = await apiService.get<{ count: number }>(`${this.baseUrl}/unread/count`);
    return response.count;
  }

  async getStats(): Promise<NotificationStats> {
    return apiService.get<NotificationStats>(`${this.baseUrl}/stats`);
  }

  async markAsRead(id: string): Promise<void> {
    await apiService.patch(`${this.baseUrl}/${id}/read`);
  }

  async markAllAsRead(): Promise<void> {
    await apiService.patch(`${this.baseUrl}/read-all`);
  }

  async deleteNotification(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  async clearAll(): Promise<void> {
    await apiService.delete(`${this.baseUrl}/clear`);
  }

  // Subscribe to real-time notifications via WebSocket
  subscribeToNotifications(callback: (notification: Notification) => void): () => void {
    // This will be implemented with WebSocket in task #26
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL || 'ws://localhost:8000'}/ws/notifications`);

    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        callback(notification);
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Return cleanup function
    return () => {
      ws.close();
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
