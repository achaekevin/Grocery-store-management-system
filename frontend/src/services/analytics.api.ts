import apiService from './api';

export interface AnalyticsData {
  id: string;
  tenantId: string;
  branchId?: string;
  metricType: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  periodStart: string;
  periodEnd: string;
  value: number;
  count?: number;
  data?: any;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  revenue: number;
  sales: number;
  orders: number;
  customers: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
}

export const analyticsApi = {
  // Get analytics data
  getAnalytics: (params?: {
    metricType?: string;
    period?: string;
    branchId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.metricType) queryParams.append('metricType', params.metricType);
    if (params?.period) queryParams.append('period', params.period);
    if (params?.branchId) queryParams.append('branchId', params.branchId);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    return apiService.get<AnalyticsResponse>(`/v1/analytics?${queryParams.toString()}`);
  },

  // Get dashboard summary
  getDashboardSummary: (branchId?: string) => {
    const queryParams = branchId ? `?branchId=${branchId}` : '';
    return apiService.get<DashboardSummaryResponse>(`/v1/analytics/dashboard/summary${queryParams}`);
  },

  // Get revenue trends
  getRevenueTrends: (params?: {
    period?: string;
    days?: number;
    branchId?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.days) queryParams.append('days', params.days.toString());
    if (params?.branchId) queryParams.append('branchId', params.branchId);

    return apiService.get<AnalyticsResponse>(`/v1/analytics/revenue/trends?${queryParams.toString()}`);
  },

  // Get top products
  getTopProducts: (params?: { limit?: number; days?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.days) queryParams.append('days', params.days.toString());

    return apiService.get<AnalyticsResponse>(`/v1/analytics/products/top?${queryParams.toString()}`);
  },

  // Get branch performance
  getBranchPerformance: (params?: { period?: string; months?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.months) queryParams.append('months', params.months.toString());

    return apiService.get<{ success: boolean; data: any }>(`/v1/analytics/branches/performance?${queryParams.toString()}`);
  },

  // Record analytics
  recordAnalytics: (data: Partial<AnalyticsData>) => {
    return apiService.post('/v1/analytics', data);
  },
};

export default analyticsApi;
