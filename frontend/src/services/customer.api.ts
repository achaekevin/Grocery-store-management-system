import apiService from './api';

export interface CustomerProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  unit: string;
  inStock: boolean;
  stockCount: number;
  tags?: string[];
  description: string;
  branchStock: Record<string, number>;
}

export interface CartItem {
  product: CustomerProduct;
  quantity: number;
}

export interface CustomerDashboardData {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  loyalty: {
    points: number;
    tier: string;
    pointsToNextTier: number;
    nextTier: string;
    availableRewards: Array<{
      id: string;
      pointsRequired: number;
      discountAmount: number;
      title: string;
    }>;
  };
  recentOrders: any[];
  branches: any[];
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
  }>;
}

export const customerApi = {
  getDashboard: async () => {
    const response = await apiService.get<{ success: boolean; data: CustomerDashboardData }>('/customer/dashboard');
    return response.data;
  },

  getProducts: async (params?: { category?: string; search?: string; branchId?: string; sort?: string }) => {
    const response = await apiService.get<{ success: boolean; data: CustomerProduct[] }>('/customer/products', { params });
    return response.data;
  },

  getCoupons: async () => {
    const response = await apiService.get<{ success: boolean; data: any[] }>('/customer/coupons');
    return response.data;
  },

  getLoyalty: async () => {
    const response = await apiService.get<{ success: boolean; data: any }>('/customer/loyalty');
    return response.data;
  },

  getOrders: async () => {
    const response = await apiService.get<{ success: boolean; data: any[] }>('/customer/orders');
    return response.data;
  },

  placeOrder: async (orderData: any) => {
    const response = await apiService.post<{ success: boolean; data: any }>('/customer/orders', orderData);
    return response;
  },

  submitReview: async (reviewData: { productId: number; rating: number; comment: string }) => {
    const response = await apiService.post<{ success: boolean; data: any }>('/customer/reviews', reviewData);
    return response;
  },
};
