import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Package,
  Barcode,
  TrendingUp,
  Building2,
  Tag,
  Calendar,
  Edit,
  Trash2,
  Star,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiService from '@/services/api';
import QRCode from 'qrcode';

export const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const { data: product } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiService.get(`/products/${id}`),
  });

  const { data: salesHistory } = useQuery({
    queryKey: ['product-sales', id],
    queryFn: () => apiService.get(`/products/${id}/sales-history`),
  });

  const { data: branchAvailability } = useQuery({
    queryKey: ['product-branches', id],
    queryFn: () => apiService.get(`/products/${id}/branches`),
  });

  React.useEffect(() => {
    if (product?.barcode) {
      QRCode.toDataURL(product.barcode).then(setQrCodeUrl);
    }
  }, [product?.barcode]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Product Details
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {product.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex gap-6">
              <div className="w-48 h-48 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Package className="w-24 h-24 text-gray-400" />
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Product Name</label>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Price</label>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      KSh {product.price?.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Stock</label>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.stock}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Tag className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-900 dark:text-white">{product.category}</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Supplier</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-900 dark:text-white">{product.supplier}</span>
                  </div>
                </div>
              </div>
            </div>

            {product.description && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{product.description}</p>
              </div>
            )}
          </div>

          {/* Sales History Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sales History
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesHistory || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="quantity" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Branch Availability */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Branch Availability
            </h3>
            <div className="space-y-3">
              {branchAvailability?.map((branch: any) => (
                <div
                  key={branch.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {branch.name}
                      </p>
                      <p className="text-xs text-gray-500">{branch.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {branch.stock} units
                    </p>
                    <p className={`text-xs ${branch.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      {branch.stock > 10 ? 'In Stock' : 'Low Stock'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Barcode & QR */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Codes
            </h3>
            
            {/* Barcode */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                <Barcode className="w-4 h-4" />
                Barcode
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
                <p className="font-mono text-lg">{product.barcode}</p>
              </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                  QR Code
                </label>
                <div className="flex justify-center p-4 bg-white rounded-lg border border-gray-200">
                  <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
                </div>
              </div>
            )}
          </div>

          {/* Product Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Sales</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {product.totalSales || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  ${product.revenue?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Reviews Summary */}
          {product.reviews && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Customer Reviews
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {product.averageRating?.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {product.reviewCount} reviews
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
