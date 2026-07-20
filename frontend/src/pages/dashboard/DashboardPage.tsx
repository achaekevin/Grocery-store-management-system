import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@components/common/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/Card';
import {
  DollarSign,
  Package,
  AlertTriangle,
  Calendar,
  Users,
  Truck,
  Building2,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@utils/format';
import { useAppSelector } from '@hooks/useAppSelector';
import { useToast } from '@hooks/useToast';
import axios from 'axios';

interface DashboardStats {
  todaySales: number;
  todayOrders: number;
  monthlySales: number;
  monthlyOrders: number;
  products: number;
  customers: number;
  suppliers: number;
  lowStock: number;
  expiredProducts: number;
  pendingOrders: number;
  revenueTrend: Array<{ date: string; revenue: number; orders: number }>;
  topProducts: Array<{ productName: string; quantity: number; revenue: number }>;
}

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAppSelector((state) => state.auth);
  const toast = useToast();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState(0);

  useEffect(() => {
    if (token) {
      fetchDashboardStats();
      fetchBranches();
    }
  }, [token]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setStats(response.data.data);
      } else {
        // Initialize with zeros if no data
        setStats({
          todaySales: 0,
          todayOrders: 0,
          monthlySales: 0,
          monthlyOrders: 0,
          products: 0,
          customers: 0,
          suppliers: 0,
          lowStock: 0,
          expiredProducts: 0,
          pendingOrders: 0,
          revenueTrend: [],
          topProducts: [],
        });
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      // Initialize with zeros on error
      setStats({
        todaySales: 0,
        todayOrders: 0,
        monthlySales: 0,
        monthlyOrders: 0,
        products: 0,
        customers: 0,
        suppliers: 0,
        lowStock: 0,
        expiredProducts: 0,
        pendingOrders: 0,
        revenueTrend: [],
        topProducts: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/branches`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBranches(response.data?.data?.length || 0);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setBranches(0);
    }
  };

  // Format revenue trend data for chart
  const formatRevenueTrend = () => {
    if (!stats?.revenueTrend || stats.revenueTrend.length === 0) {
      return [];
    }

    return stats.revenueTrend.map((item) => ({
      day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
      sales: parseFloat(item.revenue.toString()),
      orders: parseInt(item.orders.toString()),
    }));
  };

  // Calculate yesterday's sales for comparison
  const calculateYesterdayComparison = () => {
    const trend = stats?.revenueTrend || [];
    if (trend.length < 2) return 0;

    const today = parseFloat(trend[trend.length - 1]?.revenue?.toString() || '0');
    const yesterday = parseFloat(trend[trend.length - 2]?.revenue?.toString() || '0');

    if (yesterday === 0) return 0;
    return ((today - yesterday) / yesterday) * 100;
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const revenueTrendData = formatRevenueTrend();
  const yesterdayChange = calculateYesterdayComparison();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back! Here's what's happening with your stores today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div onClick={() => navigate('/sales')} className="cursor-pointer">
          <StatCard
            title="Today's Sales"
            value={formatCurrency(stats.todaySales)}
            icon={DollarSign}
            iconColor="text-green-600"
            iconBgColor="bg-green-100 dark:bg-green-900/20"
            change={yesterdayChange}
            changeLabel="from yesterday"
          />
        </div>
        <div onClick={() => navigate('/reports')} className="cursor-pointer">
          <StatCard
            title="Monthly Revenue"
            value={formatCurrency(stats.monthlySales)}
            icon={TrendingUp}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          />
        </div>
        <div onClick={() => navigate('/products')} className="cursor-pointer">
          <StatCard
            title="Products"
            value={stats.products.toString()}
            icon={Package}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-100 dark:bg-purple-900/20"
          />
        </div>
        <div onClick={() => navigate('/inventory')} className="cursor-pointer">
          <StatCard
            title="Low Stock Items"
            value={stats.lowStock.toString()}
            icon={AlertTriangle}
            iconColor="text-orange-600"
            iconBgColor="bg-orange-100 dark:bg-orange-900/20"
          />
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div onClick={() => navigate('/customers')} className="cursor-pointer">
          <StatCard
            title="Customers"
            value={stats.customers.toString()}
            icon={Users}
            iconColor="text-cyan-600"
            iconBgColor="bg-cyan-100 dark:bg-cyan-900/20"
          />
        </div>
        <div onClick={() => navigate('/suppliers')} className="cursor-pointer">
          <StatCard
            title="Suppliers"
            value={stats.suppliers.toString()}
            icon={Truck}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-100 dark:bg-indigo-900/20"
          />
        </div>
        <div onClick={() => navigate('/branches')} className="cursor-pointer">
          <StatCard
            title="Branches"
            value={branches.toString()}
            icon={Building2}
            iconColor="text-pink-600"
            iconBgColor="bg-pink-100 dark:bg-pink-900/20"
          />
        </div>
        <div onClick={() => navigate('/inventory')} className="cursor-pointer">
          <StatCard
            title="Expired Products"
            value={stats.expiredProducts.toString()}
            icon={Calendar}
            iconColor="text-red-600"
            iconBgColor="bg-red-100 dark:bg-red-900/20"
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>No sales data available yet</p>
                  <p className="text-sm mt-2">Start making sales to see your trend</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="orders" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>No order data available yet</p>
                  <p className="text-sm mt-2">Process orders to see statistics</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.todaySales)}</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-600 opacity-50" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                <div>
                  <p className="text-sm text-muted-foreground">Orders Completed</p>
                  <p className="text-2xl font-bold">{stats.todayOrders}</p>
                </div>
                <Package className="h-10 w-10 text-blue-600 opacity-50" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.monthlySales)}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-primary opacity-50" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{stats.monthlyOrders}</p>
                </div>
                <Package className="h-10 w-10 text-purple-600 opacity-50" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <button
              onClick={() => navigate('/products')}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition"
            >
              <Package className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-semibold">Manage Products</p>
                <p className="text-sm text-muted-foreground">{stats.products} items</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/inventory')}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition"
            >
              <AlertTriangle className="h-8 w-8 text-orange-600" />
              <div className="text-left">
                <p className="font-semibold">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">{stats.lowStock} items</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/customers')}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition"
            >
              <Users className="h-8 w-8 text-cyan-600" />
              <div className="text-left">
                <p className="font-semibold">View Customers</p>
                <p className="text-sm text-muted-foreground">{stats.customers} registered</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-accent transition"
            >
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold">Generate Reports</p>
                <p className="text-sm text-muted-foreground">View analytics</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
