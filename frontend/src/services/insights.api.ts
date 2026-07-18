import apiService from './api';

export interface Insight {
  id: string;
  tenantId: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation?: string;
  data: any;
  actionable: boolean;
  actionUrl?: string;
  dismissed: boolean;
  dismissedAt?: string;
  expiresAt?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InsightsSummary {
  total: number;
  critical: number;
  high: number;
  actionable: number;
  dismissed: number;
}

export interface InsightsResponse {
  success: boolean;
  data: Insight[];
}

export interface InsightResponse {
  success: boolean;
  data: Insight;
}

export interface InsightsSummaryResponse {
  success: boolean;
  data: InsightsSummary;
}

export const insightsApi = {
  // Get all insights
  getInsights: (params?: {
    type?: string;
    priority?: string;
    dismissed?: boolean;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.dismissed !== undefined) queryParams.append('dismissed', params.dismissed.toString());

    return apiService.get<InsightsResponse>(`/v1/insights?${queryParams.toString()}`);
  },

  // Get insights summary
  getInsightsSummary: () => {
    return apiService.get<InsightsSummaryResponse>('/v1/insights/summary');
  },

  // Get insight by ID
  getInsightById: (id: string) => {
    return apiService.get<InsightResponse>(`/v1/insights/${id}`);
  },

  // Create insight
  createInsight: (data: Partial<Insight>) => {
    return apiService.post<InsightResponse>('/v1/insights', data);
  },

  // Dismiss insight
  dismissInsight: (id: string) => {
    return apiService.patch<InsightResponse>(`/v1/insights/${id}/dismiss`);
  },

  // Delete insight
  deleteInsight: (id: string) => {
    return apiService.delete(`/v1/insights/${id}`);
  },
};

export default insightsApi;
