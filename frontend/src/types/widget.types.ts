export type WidgetType =
  | 'sales_overview'
  | 'revenue_chart'
  | 'inventory_status'
  | 'low_stock_alert'
  | 'recent_orders'
  | 'top_products'
  | 'customer_stats'
  | 'branch_performance'
  | 'financial_summary'
  | 'activity_feed'
  | 'notifications'
  | 'quick_actions';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  size: WidgetSize;
  position: {
    x: number;
    y: number;
  };
  config?: Record<string, any>;
  refreshInterval?: number;
  isVisible: boolean;
}

export interface WidgetLayout {
  id: string;
  name: string;
  widgets: Widget[];
  isDefault: boolean;
  userId: string;
}

export interface WidgetData {
  widgetId: string;
  data: any;
  lastUpdated: Date;
}
