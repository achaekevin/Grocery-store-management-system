import apiService from './api';

export interface Review {
  id: string;
  tenantId: string;
  productId: string;
  customerId: string;
  orderId?: string;
  rating: number;
  title?: string;
  comment?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  product?: any;
  customer?: any;
}

export interface ReviewStats {
  total: number;
  averageRating: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ProductReviewsResponse {
  success: boolean;
  data: {
    reviews: Review[];
    stats: ReviewStats;
  };
}

export interface ReviewStatsResponse {
  success: boolean;
  data: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const reviewsApi = {
  // Get all reviews
  getReviews: (params?: {
    productId?: string;
    customerId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.productId) queryParams.append('productId', params.productId);
    if (params?.customerId) queryParams.append('customerId', params.customerId);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    return apiService.get<ReviewsResponse>(`/v1/reviews?${queryParams.toString()}`);
  },

  // Get product reviews
  getProductReviews: (productId: string) => {
    return apiService.get<ProductReviewsResponse>(`/v1/reviews/product/${productId}`);
  },

  // Get review statistics
  getReviewStats: () => {
    return apiService.get<ReviewStatsResponse>('/v1/reviews/stats');
  },

  // Create review
  createReview: (data: {
    productId: string;
    customerId: string;
    rating: number;
    title?: string;
    comment?: string;
    orderId?: string;
  }) => {
    return apiService.post('/v1/reviews', data);
  },

  // Update review status
  updateReviewStatus: (id: string, status: string) => {
    return apiService.patch(`/v1/reviews/${id}/status`, { status });
  },

  // Mark review as helpful
  markReviewHelpful: (id: string) => {
    return apiService.post(`/v1/reviews/${id}/helpful`);
  },

  // Delete review
  deleteReview: (id: string) => {
    return apiService.delete(`/v1/reviews/${id}`);
  },
};

export default reviewsApi;
