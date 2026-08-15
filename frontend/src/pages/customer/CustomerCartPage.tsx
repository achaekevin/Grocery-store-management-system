import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Tag,
  Gift,
  ShieldCheck,
  Store,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import {
  removeFromCustomerCart,
  updateCustomerCartQuantity,
  clearCustomerCart,
  applyCoupon,
  setPointsToRedeem,
  setDeliveryType,
} from '@store/slices/customerPortalSlice';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';

export const CustomerCartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { success, error } = useToast();

  const { cart, selectedBranch, deliveryType, appliedCoupon, pointsToRedeem, loyaltyPointsBalance } =
    useAppSelector((state) => state.customerPortal);

  const [couponInput, setCouponInput] = useState('');
  const [selectedPointsOption, setSelectedPointsOption] = useState<number>(pointsToRedeem);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Coupon calculation
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.min((cartSubtotal * appliedCoupon.discountPercent) / 100, 500);
    } else if (appliedCoupon.discountAmount) {
      couponDiscount = appliedCoupon.discountAmount;
    }
  }

  // Loyalty points discount calculation (500 pts = 50 KSh, 1000 pts = 120 KSh, 2000 pts = 250 KSh)
  let loyaltyDiscount = 0;
  if (selectedPointsOption === 500) loyaltyDiscount = 50;
  if (selectedPointsOption === 1000) loyaltyDiscount = 120;
  if (selectedPointsOption === 2000) loyaltyDiscount = 250;

  const deliveryFee = deliveryType === 'Pickup' ? 0 : 100;
  const totalDiscounts = couponDiscount + loyaltyDiscount;
  const finalTotal = Math.max(0, cartSubtotal - totalDiscounts + deliveryFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    if (code === 'GROCERY20') {
      dispatch(applyCoupon({ code: 'GROCERY20', title: '20% OFF Weekend Sale', discountPercent: 20 }));
      success('Applied 20% OFF promo code GROCERY20!');
    } else if (code === 'WELCOME10') {
      dispatch(applyCoupon({ code: 'WELCOME10', title: '10% OFF Welcome Bonus', discountPercent: 10 }));
      success('Applied 10% OFF promo code WELCOME10!');
    } else if (code === 'FREESHIP') {
      dispatch(applyCoupon({ code: 'FREESHIP', title: 'Free Delivery', discountAmount: 100 }));
      success('Applied Free Delivery voucher!');
    } else {
      error('Invalid promo code. Try GROCERY20 or WELCOME10');
    }
    setCouponInput('');
  };

  const handleApplyLoyaltyDiscount = (points: number) => {
    if (selectedPointsOption === points) {
      setSelectedPointsOption(0);
      dispatch(setPointsToRedeem(0));
      success('Removed loyalty reward points discount.');
    } else {
      setSelectedPointsOption(points);
      dispatch(setPointsToRedeem(points));
      success(`Applied ${points} points for instant discount!`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="h-20 w-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
          <ShoppingCart className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Your Basket is Empty</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          You haven&apos;t added any groceries to your basket yet. Explore our farm-fresh catalog now.
        </p>
        <Link
          to="/customer/shop"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-xs transition"
        >
          <Store className="h-4 w-4" /> Start Grocery Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Shopping Basket</h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Review items, apply discount coupons, and redeem loyalty points
          </p>
        </div>

        <button
          onClick={() => dispatch(clearCustomerCart())}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 self-start"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Item & Description</span>
              <span className="hidden sm:inline">Unit Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>

            <div className="divide-y divide-slate-100">
              {cart.map((item) => (
                <div key={item.product.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 object-cover rounded-xl border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{item.product.unit} • {item.product.brand}</p>
                      <button
                        onClick={() => dispatch(removeFromCustomerCart(item.product.id))}
                        className="text-[11px] text-rose-500 hover:underline flex items-center gap-0.5 mt-1 font-medium"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>

                  <div className="hidden sm:block text-xs font-bold text-slate-700">
                    KSh {item.product.price}
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() =>
                        dispatch(
                          updateCustomerCartQuantity({
                            productId: item.product.id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                      className="p-1 rounded bg-white text-slate-700 hover:bg-slate-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateCustomerCartQuantity({
                            productId: item.product.id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="p-1 rounded bg-white text-slate-700 hover:bg-slate-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm font-extrabold text-emerald-800 text-right min-w-16">
                    KSh {(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery vs Pickup Selector */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600" /> Fulfillment Method & Branch
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => dispatch(setDeliveryType('Delivery'))}
                className={cn(
                  'p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between',
                  deliveryType === 'Delivery'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                )}
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Doorstep Delivery (KSh 100)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dispatched to your home or office</p>
                </div>
                {deliveryType === 'Delivery' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              </div>

              <div
                onClick={() => dispatch(setDeliveryType('Pickup'))}
                className={cn(
                  'p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between',
                  deliveryType === 'Pickup'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                )}
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Store Pickup (FREE)</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Collect at {selectedBranch}</p>
                </div>
                {deliveryType === 'Pickup' && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Discounts Card */}
        <div className="space-y-4">
          {/* Promo Code Input */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-emerald-600" /> Have a Promo Code?
            </h3>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="e.g. GROCERY20"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs"
              >
                Apply
              </button>
            </form>

            {appliedCoupon && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs">
                <span className="font-bold text-emerald-800">✓ {appliedCoupon.title}</span>
                <button
                  onClick={() => dispatch(applyCoupon(null))}
                  className="text-rose-500 hover:underline font-semibold text-[11px]"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Loyalty Points Redemption Slider */}
          <div className="bg-amber-50 rounded-3xl p-5 border border-amber-200 shadow-2xs space-y-3 text-amber-950">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold flex items-center gap-1.5">
                <Gift className="h-4 w-4 text-amber-600" /> Redeem Loyalty Points
              </h3>
              <span className="text-[11px] font-extrabold bg-amber-200 px-2 py-0.5 rounded-md">
                {loyaltyPointsBalance.toLocaleString()} pts
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {[
                { pts: 500, disc: 50 },
                { pts: 1000, disc: 120 },
                { pts: 2000, disc: 250 },
              ].map((opt) => {
                const isSelected = selectedPointsOption === opt.pts;
                return (
                  <button
                    key={opt.pts}
                    type="button"
                    onClick={() => handleApplyLoyaltyDiscount(opt.pts)}
                    className={cn(
                      'p-2 rounded-xl border text-[11px] font-bold transition flex flex-col items-center',
                      isSelected
                        ? 'bg-amber-950 text-amber-100 border-amber-950 shadow-xs'
                        : 'bg-white/80 text-amber-950 border-amber-300 hover:bg-white'
                    )}
                  >
                    <span>{opt.pts} pts</span>
                    <span className="text-[10px] opacity-90">-KSh {opt.disc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">Order Summary</h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-bold text-slate-900">KSh {cartSubtotal.toLocaleString()}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>-KSh {couponDiscount.toLocaleString()}</span>
                </div>
              )}

              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Loyalty Points Voucher</span>
                  <span>-KSh {loyaltyDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-slate-900">
                  {deliveryType === 'Pickup' ? 'FREE (Pickup)' : `KSh ${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-900">Total Payable</span>
                <p className="text-[10px] text-slate-400 font-medium">Inclusive of all taxes (16% VAT)</p>
              </div>
              <span className="text-xl font-black text-emerald-800">KSh {finalTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={() => navigate('/customer/checkout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2 mt-3"
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Safe & Secure M-Pesa STK Push Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
