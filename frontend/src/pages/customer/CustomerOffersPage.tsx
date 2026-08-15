import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Copy, Check, Percent, Flame, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { applyCoupon } from '@store/slices/customerPortalSlice';
import { customerApi } from '@services/customer.api';
import { useToast } from '@hooks/useToast';

export const CustomerOffersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success } = useToast();

  const [coupons, setCoupons] = useState<any[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await customerApi.getCoupons();
        setCoupons(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopyAndApply = (coupon: any) => {
    navigator.clipboard.writeText(coupon.code);
    setCopiedCode(coupon.code);
    dispatch(
      applyCoupon({
        code: coupon.code,
        title: coupon.title,
        discountPercent: coupon.discountPercent,
        discountAmount: coupon.discountAmount,
      })
    );
    success(`Copied and applied coupon code ${coupon.code} to your cart!`);

    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Active Offers &amp; Promo Coupons</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Tap any voucher to copy and automatically apply it to your basket
        </p>
      </div>

      {/* Featured Weekend Sale Banner */}
      <div className="bg-emerald-600 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-3 text-center sm:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Flame className="h-4 w-4 text-amber-300 fill-amber-300" /> Weekend Fresh Grocery Sale
          </div>
          <h2 className="text-3xl sm:text-4xl font-black">20% OFF Entire Fresh Grocery Basket</h2>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-lg">
            Valid until August 20, 2026 across all branches in Kisii &amp; Nyamira. Free delivery on orders over KSh 1,500.
          </p>
        </div>

        <button
          onClick={() =>
            handleCopyAndApply({
              code: 'GROCERY20',
              title: '20% OFF Weekend Sale',
              discountPercent: 20,
            })
          }
          className="bg-white hover:bg-emerald-50 text-emerald-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0"
        >
          {copiedCode === 'GROCERY20' ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          {copiedCode === 'GROCERY20' ? 'Coupon Applied!' : 'Apply Code: GROCERY20'}
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          return (
            <div
              key={coupon.code}
              className="bg-white rounded-3xl p-6 border-2 border-dashed border-slate-300 shadow-2xs hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-lg">
                    {coupon.discountPercent ? `${coupon.discountPercent}% OFF` : `KSh ${coupon.discountAmount} OFF`}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Valid to {coupon.validUntil}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mt-3">{coupon.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{coupon.description}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-2">Min Spend: KSh {coupon.minSpend}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200">
                  {coupon.code}
                </span>

                <button
                  onClick={() => handleCopyAndApply(coupon)}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? 'Applied' : 'Apply'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
