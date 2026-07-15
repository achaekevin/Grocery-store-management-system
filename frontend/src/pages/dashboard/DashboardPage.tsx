import React from 'react';
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
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
import { Badge } from '@components/ui/Badge';

const dailySalesData = [
  { day: 'Mon', sales: 187400, orders: 212 },
  { day: 'Tue', sales: 143200, orders: 178 },
  { day: 'Wed', sales: 234500, orders: 289 },
  { day: 'Thu', sales: 198000, orders: 244 },
  { day: 'Fri', sales: 312000, orders: 387 },
  { day: 'Sat', sales: 445000, orders: 512 },
  { day: 'Sun', sales: 389000, orders: 456 },
];

const monthlySalesData = [
  { month: 'Jan', revenue: 4200000, expenses: 1800000 },
  { month: 'Feb', revenue: 3900000, expenses: 1650000 },
  { month: 'Mar', revenue: 4800000, expenses: 1950000 },
  { month: 'Apr', revenue: 5100000, expenses: 2100000 },
  { month: 'May', revenue: 4600000, expenses: 1900000 },
  { month: 'Jun', revenue: 5400000, expenses: 2200000 },
];

const topProducts = [
  { name: 'Milk 1L', sales: 2345 },
  { name: 'Bread', sales: 1890 },
  { name: 'Water 500ml', sales: 1654 },
  { name: 'Coke 500ml', sales: 1432 },
  { name: 'Eggs Tray', sales: 1298 },
];

const categoryData = [
  { name: 'Dairy', value: 28 },
  { name: 'Beverages', value: 22 },
  { name: 'Bakery', value: 18 },
  { name: 'Fresh Produce', value: 15 },
  { name: 'Pantry', value: 12 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed', '#0891b2'];

const recentActivities = [
  { id: 1, action: 'Sale completed', desc: 'KSh 4,250 - CBD Branch', time: '2 min ago', type: 'success' },
  { id: 2, action: 'Low stock alert', desc: 'Tomatoes 1kg - 12 units left', time: '5 min ago', type: 'warning' },
  { id: 3, action: 'New customer', desc: 'Alice Wanjiku registered', time: '12 min ago', type: 'info' },
  { id: 4, action: 'Purchase order', desc: 'PO-2025-0088 approved', time: '1 hr ago', type: 'success' },
  { id: 5, action: 'Product expired', desc: 'Chicken Breast 500g', time: '2 hrs ago', type: 'danger' },
];

export const DashboardPage: React.FC = () => {
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
        <StatCard
          title="Today's Sales"
          value={formatCurrency(389000)}
          icon={DollarSign}
          iconColor="text-green-600"
          iconBgColor="bg-green-100 dark:bg-green-900/20"
          change={12.5}
          changeLabel="from yesterday"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(8400000)}
          icon={TrendingUp}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100 dark:bg-blue-900/20"
          change={8.3}
          changeLabel="from last month"
        />
        <StatCard
          title="Products"
          value="1,234"
          icon={Package}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100 dark:bg-purple-900/20"
        />
        <StatCard
          title="Low Stock Items"
          value="23"
          icon={AlertTriangle}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100 dark:bg-orange-900/20"
          change={-5}
          changeLabel="from last week"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Customers"
          value="2,458"
          icon={Users}
          iconColor="text-cyan-600"
          iconBgColor="bg-cyan-100 dark:bg-cyan-900/20"
        />
        <StatCard
          title="Suppliers"
          value="127"
          icon={Truck}
          iconColor="text-indigo-600"
          iconBgColor="bg-indigo-100 dark:bg-indigo-900/20"
        />
        <StatCard
          title="Branches"
          value="4"
          icon={Building2}
          iconColor="text-pink-600"
          iconBgColor="bg-pink-100 dark:bg-pink-900/20"
        />
        <StatCard
          title="Expired Products"
          value="8"
          icon={Calendar}
          iconColor="text-red-600"
          iconBgColor="bg-red-100 dark:bg-red-900/20"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailySalesData}>
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
          </CardContent>
        </Card>

        {/* Monthly Revenue vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Selling Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#64748b" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="sales" fill="#16a34a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <Badge
                  variant={
                    activity.type === 'success'
                      ? 'success'
                      : activity.type === 'warning'
                      ? 'warning'
                      : activity.type === 'danger'
                      ? 'danger'
                      : 'info'
                  }
                  className="mt-0.5"
                >
                  {activity.type}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.desc}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
