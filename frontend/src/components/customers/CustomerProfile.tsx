import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  ShoppingBag,
  Banknote,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiService from '@/services/api';

export const CustomerProfile: React.FC = () => {
  const { id } = useParams();

  const { data: customer } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => apiService.get(`/customers/${id}`),
  });

  const { data: purchases } = useQuery({
    queryKey: ['customer-purchases', id],
    queryFn: () => apiService.get(`/customers/${id}/purchases`),
  });

  const { data: favorites } = useQuery({
    queryKey: ['customer-favorites', id],
    queryFn: () => apiService.get(`/customers/${id}/favorites`),
  });

  const { data: spendingChart } = useQuery({
    queryKey: ['customer-spending', id],
    queryFn: () => apiService.get(`/customers/${id}/spending-chart`),
  });

  if (!customer) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {customer.name.charAt(0)}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {customer.name}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Joined {new Date(customer.joinedDate).toLocaleDateString()}</span>
              </div>
              {customer.address && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customer.loyaltyPoints}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Loyalty Points</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {customer.membershipLevel}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Membership</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Banknote className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                KSh {customer.totalPurchases?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {purchases?.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Spending Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={spendingChart || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Purchases
          </h3>
          <div className="space-y-3">
            {purchases?.slice(0, 5).map((purchase: any) => (
              <div
                key={purchase.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Order #{purchase.id}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(purchase.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${purchase.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">{purchase.items} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Favorite Products
          </h3>
          <div className="space-y-3">
            {favorites?.map((fav: any) => (
              <div
                key={fav.productId}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {fav.productName}
                  </p>
                  <p className="text-xs text-gray-500">
                    Purchased {fav.purchaseCount} times
                  </p>
                </div>
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
