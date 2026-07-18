import apiService from './api';

export interface Promotion {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  promotionType: 'percentage_discount' | 'fixed_discount' | 'buy_x_get_y' | 'bundle' | 'free_shipping' | 'loyalty_bonus';
  discountValue?: number;
  conditions?: any;
  applicableTo?: any;
  code?: string;
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionStats {
  total: number;
  active: number;
  expired: number;
}

export const promotionsApi = {
  // Get all promotions
  getPromotions: (params?: { isActive?: boolean; type?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.type) queryParams.append('type', params.type);

    return apiService.get<{ success: boolean; data: Promotion[] }>(
      `/v1/promotions?${queryParams.toString()}`
    );
  },

  // Get active promotions
  getActivePromotions: () => {
    return apiService.get<{ success: boolean; data: Promotion[] }>('/v1/promotions/active');
  },

  // Get promotion by code
  getPromotionByCode: (code: string) => {
    return apiService.get<{ success: boolean; data: Promotion }>(`/v1/promotions/code/${code}`);
  },

  // Create promotion
  createPromotion: (data: Partial<Promotion>) => {
    return apiService.post<{ success: boolean; data: Promotion }>('/v1/promotions', data);
  },

  // Update promotion
  updatePromotion: (id: string, data: Partial<Promotion>) => {
    return apiService.put<{ success: boolean; data: Promotion }>(`/v1/promotions/${id}`, data);
  },

  // Apply promotion
  applyPromotion: (data: { code: string; orderData: any }) => {
    return apiService.post<{
      success: boolean;
      data: { promotion: Promotion; discount: number; finalAmount: number };
    }>('/v1/promotions/apply', data);
  },

  // Delete promotion
  deletePromotion: (id: string) => {
    return apiService.delete(`/v1/promotions/${id}`);
  },

  // Get promotion statistics
  getPromotionStats: () => {
    return apiService.get<{ success: boolean; data: PromotionStats }>('/v1/promotions/stats');
  },
};

export default promotionsApi;
