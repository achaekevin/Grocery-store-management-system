export type ActivityType =
  | 'user_login'
  | 'user_logout'
  | 'product_added'
  | 'product_updated'
  | 'product_deleted'
  | 'sale_completed'
  | 'order_created'
  | 'order_updated'
  | 'stock_transferred'
  | 'branch_created'
  | 'customer_registered'
  | 'supplier_added'
  | 'payment_received'
  | 'inventory_adjusted'
  | 'user_created'
  | 'settings_changed';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  branchId?: string;
  branchName?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  entityType?: string;
  entityId?: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface ActivityFilters {
  type?: ActivityType[];
  userId?: string;
  branchId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  entityType?: string;
  entityId?: string;
}

export interface ActivityStats {
  total: number;
  byType: Record<ActivityType, number>;
  byUser: Record<string, number>;
  byBranch: Record<string, number>;
}
