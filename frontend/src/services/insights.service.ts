import apiService from './api';
import {
  Insight,
  StockOutPrediction,
  ReorderRecommendation,
  SalesForecast,
  SlowMovingItem,
} from '@/types/insights.types';

class InsightsService {
  private readonly baseUrl = '/insights';

  async getAllInsights(): Promise<Insight[]> {
    return apiService.get<Insight[]>(this.baseUrl);
  }

  async getStockOutPredictions(): Promise<StockOutPrediction[]> {
    return apiService.get<StockOutPrediction[]>(`${this.baseUrl}/stock-out`);
  }

  async getReorderRecommendations(): Promise<ReorderRecommendation[]> {
    return apiService.get<ReorderRecommendation[]>(`${this.baseUrl}/reorder`);
  }

  async getSalesForecast(period: 'week' | 'month' | 'quarter'): Promise<SalesForecast> {
    return apiService.get<SalesForecast>(`${this.baseUrl}/forecast/sales`, {
      params: { period },
    });
  }

  async getProfitForecast(period: 'week' | 'month' | 'quarter'): Promise<any> {
    return apiService.get(`${this.baseUrl}/forecast/profit`, {
      params: { period },
    });
  }

  async getSlowMovingInventory(): Promise<SlowMovingItem[]> {
    return apiService.get<SlowMovingItem[]>(`${this.baseUrl}/slow-moving`);
  }

  async getBestSellingCategory(): Promise<any> {
    return apiService.get(`${this.baseUrl}/best-selling-category`);
  }

  async getSeasonalTrends(): Promise<any> {
    return apiService.get(`${this.baseUrl}/seasonal-trends`);
  }

  async getCustomerBehavior(): Promise<any> {
    return apiService.get(`${this.baseUrl}/customer-behavior`);
  }

  async getSupplierPerformance(): Promise<any> {
    return apiService.get(`${this.baseUrl}/supplier-performance`);
  }

  async dismissInsight(id: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/${id}/dismiss`);
  }

  async acceptRecommendation(id: string): Promise<void> {
    await apiService.post(`${this.baseUrl}/${id}/accept`);
  }
}

export const insightsService = new InsightsService();
export default insightsService;
