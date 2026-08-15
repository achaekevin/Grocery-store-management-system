import React, { useState, useEffect } from 'react';
import {
  Gift,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { updateLoyaltyBalance, setPointsToRedeem } from '@store/slices/customerPortalSlice';
import { customerApi } from '@services/customer.api';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';

export const CustomerLoyaltyPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success, error } = useToast();

  const { loyaltyPointsBalance } = useAppSelector((state) => state.customerPortal);
  const [loyaltyData, setLoyaltyData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyalty = async () => {
      try {
        setLoading(true);
        const data = await customerApi.getLoyalty();
        setLoyaltyData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLoyalty();
  }, []);

  const handleRedeemReward = (reward: any) => {
    if (loyaltyPointsBalance < reward.pointsCost) {
      error(`You need ${reward.pointsCost} points to redeem this voucher.`);
      return;
    }

    const newBalance = loyaltyPointsBalance - reward.pointsCost;
    dispatch(updateLoyaltyBalance(newBalance));
    dispatch(setPointsToRedeem(reward.pointsCost));
    success(`Redeemed ${reward.title}! Discount applied to your cart.`);
  };

  const tiers = [
    { name: 'Bronze', range: '0 - 999 pts', discount: '1% cash back', active: false },
    { name: 'Silver', range: '1,000 - 1,999 pts', discount: '3% cash back + free delivery over 2k', active: false },
    { name: 'Gold', range: '2,000 - 2,999 pts', discount: '5% cash back + priority dispatch', active: true },
    { name: 'Platinum', range: '3,000+ pts', discount: '8% cash back + personal concierge', active: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Customer Loyalty &amp; Rewards</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Earn points on every grocery item and redeem them for instant discounts at checkout
        </p>
      </div>

      {/* Gold Membership Hero Card */}
      <div className="bg-linear-to-r from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-amber-950 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-amber-950 text-amber-300 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                GOLD VIP MEMBER
              </span>
              <span className="text-amber-900 text-xs font-bold">5% Points on All Fresh Produce</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-amber-950 tracking-tight">
              {loyaltyPointsBalance.toLocaleString()} <span className="text-2xl font-bold text-amber-900">Points</span>
            </h2>
            <p className="text-xs sm:text-sm text-amber-900 font-medium max-w-md">
              You are 550 points away from unlocking <span className="font-bold underline">Platinum Member Tier</span>!
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-amber-300 shadow-sm text-center">
            <Sparkles className="h-6 w-6 text-amber-600 mx-auto" />
            <p className="text-xs font-extrabold text-amber-950 mt-1">Total Lifetime Earned</p>
            <p className="text-lg font-black text-amber-900">6,800 Pts</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="relative z-10 space-y-2 mt-8">
          <div className="w-full bg-amber-900/20 rounded-full h-3.5 overflow-hidden p-0.5">
            <div className="bg-amber-950 h-full rounded-full transition-all duration-1000" style={{ width: '81%' }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-amber-950">
            <span>Gold Tier (2,000 pts)</span>
            <span>81% to Platinum</span>
            <span>Platinum Tier (3,000 pts)</span>
          </div>
        </div>
      </div>

      {/* Membership Tiers Comparison */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Award className="h-5 w-5 text-emerald-600" /> Membership Levels &amp; Privileges
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={cn(
                'p-5 rounded-3xl border shadow-2xs space-y-3 transition flex flex-col justify-between',
                t.active
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
                  : 'bg-white border-slate-200'
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-base text-slate-900">{t.name}</h3>
                  {t.active && (
                    <span className="bg-amber-500 text-amber-950 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      CURRENT
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-500">{t.range}</p>
                <p className="text-xs text-slate-700 mt-2 font-medium leading-relaxed">{t.discount}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Instant POS points earn
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Rewards Catalog */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Gift className="h-5 w-5 text-amber-500" /> Available Reward Vouchers to Redeem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              id: 'rw_1',
              title: 'KSh 50 Off Voucher',
              pointsCost: 500,
              desc: 'Applicable on any purchase over KSh 300.',
              code: 'LOYALTY-50',
            },
            {
              id: 'rw_2',
              title: 'KSh 120 Saver Voucher',
              pointsCost: 1000,
              desc: 'Valid across all dairy, bakery & grocery sections.',
              code: 'LOYALTY-120',
            },
            {
              id: 'rw_3',
              title: 'KSh 250 VIP Voucher',
              pointsCost: 2000,
              desc: 'VIP voucher with complimentary express grocery delivery.',
              code: 'LOYALTY-250',
            },
          ].map((reward) => {
            const canAfford = loyaltyPointsBalance >= reward.pointsCost;
            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2.5 py-1 rounded-md">
                    {reward.pointsCost} POINTS
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-2">{reward.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{reward.desc}</p>
                </div>

                <button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={!canAfford}
                  className={cn(
                    'w-full py-2.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5',
                    canAfford
                      ? 'bg-amber-500 hover:bg-amber-600 text-amber-950'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  )}
                >
                  <Gift className="h-3.5 w-3.5" />
                  {canAfford ? 'Redeem Voucher' : `Need ${reward.pointsCost - loyaltyPointsBalance} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Points Ledger History */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" /> Recent Points History Ledger
        </h3>

        <div className="divide-y divide-slate-100 text-xs">
          {[
            { date: '2026-08-14', desc: 'Points earned from Order #ORD-10482', pts: '+60 pts', positive: true },
            { date: '2026-08-10', desc: 'Points earned from Order #ORD-10451', pts: '+45 pts', positive: true },
            { date: '2026-08-01', desc: 'Redeemed for KSh 120 Saver Voucher', pts: '-1,000 pts', positive: false },
            { date: '2026-07-28', desc: 'Points earned from Order #ORD-10398', pts: '+65 pts', positive: true },
          ].map((entry, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">{entry.desc}</p>
                <span className="text-slate-400 text-[11px]">{entry.date}</span>
              </div>
              <span
                className={`font-black text-sm ${entry.positive ? 'text-emerald-600' : 'text-rose-600'}`}
              >
                {entry.pts}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
