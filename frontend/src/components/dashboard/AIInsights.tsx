import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  ShoppingBag,
  Lightbulb,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { insightsService } from '@/services/insights.service';
import { Insight, InsightPriority } from '@/types/insights.types';
import { cn } from '@/utils/cn';

const priorityColors: Record<InsightPriority, string> = {
  low: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900',
  medium: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
  high: 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20',
  critical: 'border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/20',
};

const priorityBadges: Record<InsightPriority, string> = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

export const AIInsights: React.FC = () => {
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ['insights'],
    queryFn: () => insightsService.getAllInsights(),
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });

  const { data: stockOutPredictions = [] } = useQuery({
    queryKey: ['insights', 'stock-out'],
    queryFn: () => insightsService.getStockOutPredictions(),
  });

  const { data: reorderRecommendations = [] } = useQuery({
    queryKey: ['insights', 'reorder'],
    queryFn: () => insightsService.getReorderRecommendations(),
  });

  const { data: slowMoving = [] } = useQuery({
    queryKey: ['insights', 'slow-moving'],
    queryFn: () => insightsService.getSlowMovingInventory(),
  });

  const { data: salesForecast } = useQuery({
    queryKey: ['insights', 'sales-forecast'],
    queryFn: () => insightsService.getSalesForecast('week'),
  });

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Insights
        </h2>
        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
          Powered by AI
        </span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Products Likely to Run Out */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-orange-700 dark:text-orange-300">
              {stockOutPredictions.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-orange-900 dark:text-orange-200">
            Products Running Out
          </h3>
          <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
            Action required this week
          </p>
        </motion.div>

        {/* Reorder Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {reorderRecommendations.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-200">
            Reorder Suggestions
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
            Optimize your inventory
          </p>
        </motion.div>

        {/* Slow Moving Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {slowMoving.length}
            </span>
          </div>
          <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-200">
            Slow Moving Items
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
            Consider promotions
          </p>
        </motion.div>

        {/* Sales Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-green-700 dark:text-green-300">
              {salesForecast?.trend === 'up' ? '+' : ''}
              {salesForecast?.confidence || 0}%
            </span>
          </div>
          <h3 className="text-sm font-medium text-green-900 dark:text-green-200">
            Sales Forecast
          </h3>
          <p className="text-xs text-green-700 dark:text-green-400 mt-1">
            Next week prediction
          </p>
        </motion.div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Actionable Insights
        </h3>

        {insights.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              All good! No critical insights at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'rounded-lg border-2 p-4 transition-all hover:shadow-md',
                  priorityColors[insight.priority]
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="mt-1">{getImpactIcon(insight.impact)}</div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {insight.title}
                      </h4>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full shrink-0',
                        priorityBadges[insight.priority]
                      )}>
                        {insight.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {insight.description}
                    </p>

                    {/* Recommendation */}
                    {insight.recommendation && (
                      <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Recommendation:</span>{' '}
                          {insight.recommendation}
                        </p>
                      </div>
                    )}

                    {/* Confidence & Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          Confidence: {insight.confidence}%
                        </span>
                        <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                      </div>

                      {insight.actionable && insight.actionUrl && (
                        <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                          Take Action
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Predictions */}
      {stockOutPredictions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Stock Out Predictions
          </h3>
          <div className="space-y-3">
            {stockOutPredictions.slice(0, 5).map((prediction) => (
              <div
                key={prediction.productId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {prediction.productName}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Current: {prediction.currentStock} units • Will run out in{' '}
                    <span className="font-medium text-orange-600">
                      {prediction.daysUntilStockOut} days
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Recommended</p>
                  <p className="text-sm font-semibold text-blue-600">
                    {prediction.recommendedReorder} units
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
