export type InsightType =
  | 'stock_out_prediction'
  | 'best_selling_category'
  | 'slow_moving_inventory'
  | 'sales_forecast'
  | 'profit_forecast'
  | 'reorder_recommendation'
  | 'pricing_suggestion'
  | 'seasonal_trend'
  | 'customer_behavior'
  | 'supplier_performance';

export type InsightPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: InsightPriority;
  confidence: number; // 0-100
  impact: 'positive' | 'negative' | 'neutral';
  recommendation?: string;
  data: any;
  createdAt: Date;
  expiresAt?: Date;
  actionable: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface StockOutPrediction {
  productId: string;
  productName: string;
  currentStock: number;
  averageDailySales: number;
  daysUntilStockOut: number;
  recommendedReorder: number;
  confidence: number;
}

export interface ReorderRecommendation {
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  recommendedQuantity: number;
  estimatedCost: number;
  supplierId: string;
  supplierName: string;
  priority: InsightPriority;
}

export interface SalesForecast {
  period: string;
  predictedSales: number;
  predictedRevenue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

export interface SlowMovingItem {
  productId: string;
  productName: string;
  stock: number;
  daysSinceLastSale: number;
  valueAtRisk: number;
  recommendation: string;
}
