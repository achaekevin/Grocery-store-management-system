import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Phone,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Gift,
  ArrowRight,
  Printer,
  Download,
  Package,
  Store,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { clearCustomerCart } from '@store/slices/customerPortalSlice';
import { customerApi } from '@services/customer.api';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';

export const CustomerCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { success, error } = useToast();

  const { user } = useAppSelector((state) => state.auth);
  const { cart, selectedBranch, deliveryType, selectedAddress, appliedCoupon, pointsToRedeem } =
    useAppSelector((state) => state.customerPortal);

  // Form State
  const [phone, setPhone] = useState(user?.phone || '0712345678');
  const [address, setAddress] = useState(selectedAddress || 'Milimani Estate, House #14, Kisii');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'M-Pesa' | 'Card' | 'Cash on Delivery'>('M-Pesa');
  const [mpesaPhone, setMpesaPhone] = useState('0712345678');

  // Checkout Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpesaCountdown, setMpesaCountdown] = useState<number | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.min((cartSubtotal * appliedCoupon.discountPercent) / 100, 500);
    } else if (appliedCoupon.discountAmount) {
      couponDiscount = appliedCoupon.discountAmount;
    }
  }

  let loyaltyDiscount = 0;
  if (pointsToRedeem === 500) loyaltyDiscount = 50;
  if (pointsToRedeem === 1000) loyaltyDiscount = 120;
  if (pointsToRedeem === 2000) loyaltyDiscount = 250;

  const deliveryFee = deliveryType === 'Pickup' ? 0 : 100;
  const totalAmount = Math.max(0, cartSubtotal - (couponDiscount + loyaltyDiscount) + deliveryFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart.length) {
      error('Your basket is empty');
      navigate('/customer/shop');
      return;
    }

    if (paymentMethod === 'M-Pesa') {
      setIsProcessing(true);
      setMpesaCountdown(5);

      // Simulate live STK Push Countdown
      const interval = setInterval(() => {
        setMpesaCountdown((prev) => {
          if (prev && prev > 1) {
            return prev - 1;
          } else {
            clearInterval(interval);
            finishOrder();
            return null;
          }
        });
      }, 1000);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        finishOrder();
      }, 1200);
    }
  };

  const finishOrder = async () => {
    try {
      const orderPayload = {
        items: cart.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        deliveryType,
        branchName: selectedBranch,
        deliveryAddress: address,
        paymentMethod,
        mpesaPhone,
        subtotal: cartSubtotal,
        discount: couponDiscount + loyaltyDiscount,
        deliveryFee,
        total: totalAmount,
        pointsRedeemed: pointsToRedeem,
      };

      const res = await customerApi.placeOrder(orderPayload);
      setConfirmedOrder(res.data);
      dispatch(clearCustomerCart());
      success('Order placed and confirmed successfully!');
    } catch (err) {
      error('Failed to complete order');
    } finally {
      setIsProcessing(false);
    }
  };

  const printReceipt = () => {
    window.print();
  };

  // If order is confirmed, show Digital Receipt View
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 text-center">
          <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Payment Successful
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Order Confirmed #{confirmedOrder.id}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Receipt sent to <span className="font-semibold text-slate-800">{user?.email}</span> &amp; M-Pesa phone{' '}
              <span className="font-semibold text-slate-800">{mpesaPhone}</span>
            </p>
          </div>

          {/* Digital Receipt Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-4">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">GroceryOS Retail Store</h3>
                <p className="text-xs text-slate-500">{confirmedOrder.branchName}</p>
                <p className="text-xs text-slate-500">Method: {confirmedOrder.paymentMethod} • Status: Paid</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500">Date</span>
                <p className="text-xs font-semibold text-slate-800">
                  {new Date(confirmedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {confirmedOrder.items?.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span>
                    {it.name} <span className="text-slate-400">× {it.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-800">KSh {(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KSh {confirmedOrder.subtotal?.toLocaleString()}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discounts Applied</span>
                  <span>-KSh {confirmedOrder.discount?.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Mode ({confirmedOrder.deliveryType})</span>
                <span>KSh {confirmedOrder.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Paid</span>
                <span className="text-emerald-800">KSh {confirmedOrder.total?.toLocaleString()}</span>
              </div>
            </div>

            {confirmedOrder.pointsEarned > 0 && (
              <div className="bg-amber-100/70 border border-amber-300 p-3 rounded-xl flex items-center justify-between text-amber-950 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" /> Loyalty Points Earned:
                </span>
                <span>+{confirmedOrder.pointsEarned} Points Added to Gold Balance</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={printReceipt}
              className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition flex items-center gap-2"
            >
              <Printer className="h-4 w-4" /> Print / Download PDF Receipt
            </button>
            <Link
              to="/customer/orders"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition flex items-center gap-2"
            >
              <Package className="h-4 w-4" /> Track Order Status
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Complete fulfillment details and authorize instant payment
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Fulfillment & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Information */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" /> 1. Delivery & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  readOnly
                  value={`${user?.firstName || 'Kevin'} ${user?.lastName || 'Omondi'}`}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XXXXXXXX"
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {deliveryType === 'Delivery' ? (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Estate name, House number, Kisii"
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              ) : (
                <div className="sm:col-span-2 bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-xs">
                  <p className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <Store className="h-4 w-4 text-emerald-600" /> Self-Pickup at {selectedBranch}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your fresh items will be packed and available for collection at the customer service desk.
                  </p>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Notes / Special Instructions</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call upon arrival at the gate"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-emerald-600" /> 2. Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* M-Pesa STK */}
              <div
                onClick={() => setPaymentMethod('M-Pesa')}
                className={cn(
                  'p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2',
                  paymentMethod === 'M-Pesa'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                    M-PESA
                  </span>
                  {paymentMethod === 'M-Pesa' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">M-Pesa STK Push</h4>
                  <p className="text-[10px] text-slate-500">Prompt sent to phone</p>
                </div>
              </div>

              {/* Card */}
              <div
                onClick={() => setPaymentMethod('Card')}
                className={cn(
                  'p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2',
                  paymentMethod === 'Card'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  {paymentMethod === 'Card' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Credit / Debit Card</h4>
                  <p className="text-[10px] text-slate-500">Visa / Mastercard</p>
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={cn(
                  'p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-2',
                  paymentMethod === 'Cash on Delivery'
                    ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                )}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="h-5 w-5 text-amber-600" />
                  {paymentMethod === 'Cash on Delivery' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Cash on Delivery</h4>
                  <p className="text-[10px] text-slate-500">Pay rider upon receipt</p>
                </div>
              </div>
            </div>

            {/* M-Pesa STK Push Phone Details Box */}
            {paymentMethod === 'M-Pesa' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Enter Safaricom M-Pesa Phone for STK Push Prompt
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mpesaPhone}
                    onChange={(e) => setMpesaPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  You will receive a prompt on your phone to enter your M-Pesa PIN for{' '}
                  <span className="font-bold text-slate-800">KSh {totalAmount.toLocaleString()}</span>.
                </p>
              </div>
            )}

            {/* Card Payment Details Box */}
            {paymentMethod === 'Card' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800">
                    Credit / Debit Card Details
                  </label>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="font-bold text-blue-600">VISA</span>
                    <span className="font-bold text-rose-500">Mastercard</span>
                  </div>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Card Number (4000 1234 5678 9010)"
                    defaultValue="4532 •••• •••• 8821"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="password"
                    placeholder="CVV (3 digits)"
                    defaultValue="892"
                    maxLength={4}
                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  Secured 256-bit encrypted checkout authorization.
                </p>
              </div>
            )}

            {/* Cash on Delivery Details Box */}
            {paymentMethod === 'Cash on Delivery' && (
              <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
                <h4 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                  <Banknote className="h-4 w-4 text-amber-600" /> Pay Cash on Delivery
                </h4>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Please prepare exact cash or your M-Pesa app for <span className="font-bold">KSh {totalAmount.toLocaleString()}</span> when your fresh grocery rider arrives at your doorstep.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Order Summary & Action */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">Basket Details</h3>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between text-xs text-slate-700">
                  <span className="truncate max-w-44">
                    {item.product.name} <span className="text-slate-400">× {item.quantity}</span>
                  </span>
                  <span className="font-bold">KSh {(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">KSh {cartSubtotal.toLocaleString()}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-KSh {couponDiscount}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Loyalty Points Voucher</span>
                  <span>-KSh {loyaltyDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Mode ({deliveryType})</span>
                <span className="font-bold text-slate-900">
                  {deliveryType === 'Pickup' ? 'FREE' : `KSh ${deliveryFee}`}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900">Total Amount</span>
              <span className="text-xl font-black text-emerald-800">KSh {totalAmount.toLocaleString()}</span>
            </div>

            {/* STK Push Simulator Status */}
            {isProcessing && mpesaCountdown !== null && (
              <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl text-center space-y-2 animate-pulse">
                <div className="h-3 w-3 bg-emerald-400 rounded-full mx-auto animate-ping"></div>
                <p className="text-xs font-bold text-white">
                  Waiting for M-Pesa confirmation on {mpesaPhone}...
                </p>
                <p className="text-[11px] text-emerald-300">
                  Please enter your PIN on your mobile handset ({mpesaCountdown}s)
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition flex items-center justify-center gap-2"
            >
              {isProcessing ? 'Processing Order...' : `Authorize & Pay KSh ${totalAmount.toLocaleString()}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
