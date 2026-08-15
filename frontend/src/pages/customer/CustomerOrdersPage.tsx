import React, { useState, useEffect } from 'react';
import {
  Package,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
  Printer,
  ChevronRight,
  Eye,
  X,
  Send,
} from 'lucide-react';
import { customerApi } from '@services/customer.api';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';

export const CustomerOrdersPage: React.FC = () => {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrder, setActiveOrder] = useState<any | null>(null);
  const [returnModalOrder, setReturnModalOrder] = useState<any | null>(null);
  const [returnReason, setReturnReason] = useState('Product damaged');
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await customerApi.getOrders();
        setOrders(data);
        if (data.length > 0) {
          setActiveOrder(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success(`Return request submitted for Order #${returnModalOrder?.id}. Our customer desk will review shortly.`);
    setReturnModalOrder(null);
    setReturnNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready for Pickup':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">Ready for Pickup</span>;
      case 'Delivered':
      case 'Completed':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">Delivered</span>;
      case 'Preparing':
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">Preparing</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-xs font-bold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">My Orders &amp; Live Tracking</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          View your purchase history, track active deliveries, and download digital VAT receipts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Orders List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Purchase History ({orders.length})</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-slate-200 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : (
            orders.map((order) => {
              const isSelected = activeOrder?.id === order.id;
              return (
                <div
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className={cn(
                    'p-4 rounded-2xl border cursor-pointer transition shadow-2xs space-y-2.5',
                    isSelected
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-900">{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{new Date(order.createdAt).toLocaleDateString()} at 2:30 PM</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{order.branchName}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="font-semibold text-slate-500">{order.items?.length || 0} items</span>
                    <span className="font-extrabold text-slate-900">KSh {order.total.toLocaleString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right 2 Columns: Detailed Order Tracker & Receipt */}
        {activeOrder ? (
          <div className="lg:col-span-2 space-y-6">
            {/* Live Tracking Progress Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400">Tracking Timeline</span>
                  <h3 className="text-lg font-black text-slate-900">Order #{activeOrder.id}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Printer className="h-4 w-4" /> Print Receipt
                  </button>

                  <button
                    onClick={() => setReturnModalOrder(activeOrder)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <RotateCcw className="h-4 w-4" /> Request Return
                  </button>
                </div>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="space-y-4">
                {[
                  { title: 'Order Placed', desc: 'Received & verified by GroceryOS backend', time: '14:30', done: true },
                  { title: 'Payment Confirmed', desc: `Authorized via ${activeOrder.paymentMethod}`, time: '14:32', done: true },
                  { title: 'Being Prepared', desc: 'Grocery clerk packed farm-fresh produce', time: '14:45', done: true },
                  {
                    title: activeOrder.deliveryType === 'Store Pickup' ? 'Ready for Pickup' : 'Out for Delivery',
                    desc: activeOrder.deliveryType === 'Store Pickup' ? 'Awaiting collection at customer desk' : 'Dispatched with delivery rider',
                    time: activeOrder.status === 'Ready for Pickup' ? 'Current State' : '15:10',
                    current: activeOrder.status === 'Ready for Pickup',
                    done: activeOrder.status === 'Delivered',
                  },
                  { title: 'Completed', desc: 'Delivered safely to customer', time: 'Pending', done: activeOrder.status === 'Delivered' },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold',
                          step.done
                            ? 'bg-emerald-600 text-white'
                            : step.current
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        )}
                      >
                        {step.done ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                      </div>
                      {idx < 4 && <div className="w-0.5 h-10 bg-slate-200 my-1"></div>}
                    </div>

                    <div className="pt-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900">{step.title}</h4>
                        <span className="text-[11px] font-semibold text-slate-400">{step.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Purchased Grocery Items</h3>
              <div className="divide-y divide-slate-100">
                {activeOrder.items?.map((item: any, i: number) => (
                  <div key={i} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900">{item.name}</h4>
                      <span className="text-slate-500">Quantity: {item.quantity}</span>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      KSh {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Paid ({activeOrder.paymentMethod})</span>
                <span className="text-base text-emerald-800 font-extrabold">
                  KSh {activeOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <p className="font-bold text-slate-700">Select an order on the left to view live tracking details</p>
          </div>
        )}
      </div>

      {/* Return Request Modal */}
      {returnModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="h-4 w-4 text-rose-500" /> Request Return for #{returnModalOrder.id}
              </h3>
              <button onClick={() => setReturnModalOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Return</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Product damaged">Product damaged in transit</option>
                  <option value="Expired item">Product past freshness date</option>
                  <option value="Wrong item delivered">Incorrect item received</option>
                  <option value="Quality dissatisfaction">Quality not as expected</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Details</label>
                <textarea
                  rows={3}
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  placeholder="Explain any details about the product..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition"
              >
                Submit Return Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
