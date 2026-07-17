export type NotificationType = 
  | 'low_stock' 
  | 'new_order' 
  | 'mpesa_payment' 
  | 'failed_transaction' 
  | 'expiring_product' 
  | 'system_update'
  | 'user_action'
  | 'warning'
  | 'success'
  | 'error'
  | 'info';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  icon?: string;
  userId?: string;
  branchId?: string;
}

export interface NotificationFilters {
  type?: NotificationType[];
  priority?: NotificationPriority[];
  read?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}
