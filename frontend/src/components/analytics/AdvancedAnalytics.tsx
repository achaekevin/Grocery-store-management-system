import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Banknote,
  ShoppingCart,
  Package,
  Users,
  Building2,
  Calendar,
  Download,
} from 'lucide-react';
import apiService from '@/services/api';
import { cn } from '@/utils/cn';

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';
type ChartType = 'revenue' | 'sales' | 'products' | 'customers' | 'branches' | 'inventory';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const AdvancedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [activeChart, setActiveChart] = useState<ChartType>('revenue');

  // Fetch analytics data
  const { data: revenueData = [] } = useQuery({
    queryKey: ['analytics', 'revenue', timeRange],
    queryFn: () => apiService.get('/analytics/revenue', { params: { range: timeRange } }),
  });

  const { data: salesTrends = [] } = useQuery({
    queryKey: ['analytics', 'sales', timeRange],
    queryFn: () => apiService.get('/analytics/sales-trends', { params: { range: timeRange } }),
  });

  const { data: productPerformance = [] } = useQuery({
    queryKey: ['analytics', 'products', timeRange],
    queryFn: () => apiService.get('/analytics/product-performance', { params: { range: timeRange } }),
  });

  const { data: branchPerformance = [] } = useQuery({
    queryKey: ['analytics', 'branches', timeRange],
    queryFn: () => apiService.get('/analytics/branch-performance', { params: { range: timeRange } }),
  });

  const { data: customerGrowth = [] } = useQuery({
    queryKey: ['analytics', 'customers', timeRange],
    queryFn: () => apiService.get('/analytics/customer-growth', { params: { range: timeRange } }),
  });

  const { data: inventoryValue = [] } = useQuery({
    queryKey: ['analytics', 'inventory', timeRange],
    queryFn: () => apiService.get('/analytics/inventory-value', { params: { range: timeRange } }),
  });

  const { data: paymentMethods = [] } = useQuery({
    queryKey: ['analytics', 'payment-methods', timeRange],
    queryFn: () => apiService.get('/analytics/payment-methods', { params: { range: timeRange } }),
  });

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ];

  const chartOptions = [
    { value: 'revenue', label: 'Revenue', icon: Banknote },
    { value: 'sales', label: 'Sales Trends', icon: TrendingUp },
    { value: 'products', label: 'Product Performance', icon: Package },
    { value: 'customers', label: 'Customer Growth', icon: Users },
    { value: 'branches', label: 'Branch Performance', icon: Building2 },
    { value: 'inventory', label: 'Inventory Value', icon: ShoppingCart },
  ];

  const handleExport = () => {
    // Export current chart data
    console.log('Exporting chart data...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Advanced Analytics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Interactive charts and insights for your business
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Calendar className="w-5 h-5 text-gray-500 shrink-0" />
        {timeRangeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value as TimeRange)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
              timeRange === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Chart Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {chartOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => setActiveChart(option.value as ChartType)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                activeChart === option.value
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              )}
            >
              <Icon className={cn(
                'w-6 h-6',
                activeChart === option.value
                  ? 'text-blue-600'
                  : 'text-gray-500'
              )} />
              <span className={cn(
                'text-xs font-medium text-center',
                activeChart === option.value
                  ? 'text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300'
              )}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        {activeChart === 'revenue' && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue Over Time
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Sales Trends */}
        {activeChart === 'sales' && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sales Trends
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Product Performance */}
        {activeChart === 'products' && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Top Products by Sales
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={productPerformance.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Product Category Distribution
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={productPerformance.slice(0, 6)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => entry.name}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {productPerformance.slice(0, 6).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Customer Growth */}
        {activeChart === 'customers' && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Growth
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={customerGrowth}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="customers"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCustomers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Branch Performance */}
        {activeChart === 'branches' && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Branch Performance Comparison
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Inventory Value */}
        {activeChart === 'inventory' && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Inventory Value Over Time
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={inventoryValue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Payment Methods Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethods}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethods.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-3">
            {paymentMethods.map((method: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    KSh {method.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">{method.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
