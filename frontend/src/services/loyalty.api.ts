import apiService from './api';

export interface LoyaltyProgram {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  pointsPerCurrency: number;
  currencyPerPoint: number;
  minPointsRedemption: number;
  membershipTiers: any[];
  benefits?: any;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerLoyalty {
  id: string;
  tenantId: string;
  customerId: string;
  programId: string;
  pointsBalance: number;
  lifetimePoints: number;
  tier: string;
  tierStartDate?: string;
  joinedAt: string;
  lastActivityAt?: string;
  program?: LoyaltyProgram;
  customer?: any;
}

export interface LoyaltyStats {
  totalMembers: number;
  activePrograms: number;
  totalPoints: number;
  tierDistribution: Array<{ tier: string; count: number }>;
}

export const loyaltyApi = {
  // Get all loyalty programs
  getLoyaltyPrograms: () => {
    return apiService.get<{ success: boolean; data: LoyaltyProgram[] }>('/v1/loyalty/programs');
  },

  // Get active program
  getActiveProgram: () => {
    return apiService.get<{ success: boolean; data: LoyaltyProgram }>('/v1/loyalty/programs/active');
  },

  // Create loyalty program
  createLoyaltyProgram: (data: Partial<LoyaltyProgram>) => {
    return apiService.post<{ success: boolean; data: LoyaltyProgram }>('/v1/loyalty/programs', data);
  },

  // Update loyalty program
  updateLoyaltyProgram: (id: string, data: Partial<LoyaltyProgram>) => {
    return apiService.put<{ success: boolean; data: LoyaltyProgram }>(`/v1/loyalty/programs/${id}`, data);
  },

  // Get customer loyalty
  getCustomerLoyalty: (customerId: string) => {
    return apiService.get<{ success: boolean; data: CustomerLoyalty }>(`/v1/loyalty/customers/${customerId}`);
  },

  // Enroll customer
  enrollCustomer: (data: { customerId: string; programId: string }) => {
    return apiService.post<{ success: boolean; data: CustomerLoyalty }>('/v1/loyalty/enroll', data);
  },

  // Add points
  addPoints: (customerId: string, data: { points: number; reason?: string }) => {
    return apiService.post<{ success: boolean; data: CustomerLoyalty }>(
      `/v1/loyalty/customers/${customerId}/points/add`,
      data
    );
  },

  // Redeem points
  redeemPoints: (customerId: string, data: { points: number }) => {
    return apiService.post<{
      success: boolean;
      data: { loyalty: CustomerLoyalty; redeemedPoints: number; redemptionValue: number };
    }>(`/v1/loyalty/customers/${customerId}/points/redeem`, data);
  },

  // Get loyalty statistics
  getLoyaltyStats: () => {
    return apiService.get<{ success: boolean; data: LoyaltyStats }>('/v1/loyalty/stats');
  },
};

export default loyaltyApi;
