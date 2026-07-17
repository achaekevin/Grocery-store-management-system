import { useQuery } from '@tanstack/react-query';
import { activityService } from '@/services/activity.service';
import { ActivityFilters } from '@/types/activity.types';

export const useActivityTimeline = (filters?: ActivityFilters) => {
  const { data: activities = [], isLoading, error, refetch } = useQuery({
    queryKey: ['activities', filters],
    queryFn: () => activityService.getActivities(filters),
    staleTime: 1000 * 60, // 1 minute
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const { data: stats } = useQuery({
    queryKey: ['activities', 'stats', filters],
    queryFn: () => activityService.getStats(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    activities,
    stats,
    isLoading,
    error,
    refetch,
  };
};

export const useRecentActivities = (limit: number = 10) => {
  const { data: activities = [], isLoading, error } = useQuery({
    queryKey: ['activities', 'recent', limit],
    queryFn: () => activityService.getRecentActivities(limit),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 30000,
  });

  return {
    activities,
    isLoading,
    error,
  };
};
