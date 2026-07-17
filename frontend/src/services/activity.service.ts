import apiService from './api';
import { Activity, ActivityFilters, ActivityStats } from '@/types/activity.types';

class ActivityService {
  private readonly baseUrl = '/activities';

  async getActivities(filters?: ActivityFilters): Promise<Activity[]> {
    return apiService.get<Activity[]>(this.baseUrl, { params: filters });
  }

  async getActivityById(id: string): Promise<Activity> {
    return apiService.get<Activity>(`${this.baseUrl}/${id}`);
  }

  async getStats(filters?: ActivityFilters): Promise<ActivityStats> {
    return apiService.get<ActivityStats>(`${this.baseUrl}/stats`, { params: filters });
  }

  async getUserActivities(userId: string): Promise<Activity[]> {
    return apiService.get<Activity[]>(`${this.baseUrl}/user/${userId}`);
  }

  async getBranchActivities(branchId: string): Promise<Activity[]> {
    return apiService.get<Activity[]>(`${this.baseUrl}/branch/${branchId}`);
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return apiService.get<Activity[]>(`${this.baseUrl}/recent`, {
      params: { limit },
    });
  }

  // Log activity (called internally by other services)
  async logActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<Activity> {
    return apiService.post<Activity>(this.baseUrl, activity);
  }
}

export const activityService = new ActivityService();
export default activityService;
