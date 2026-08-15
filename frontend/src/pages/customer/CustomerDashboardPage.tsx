import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Package,
  Heart,
  Gift,
  CreditCard,
  MapPin,
  Search,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Star,
  Flame,
  Truck,
  Percent,
  Zap,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { addToCustomerCart, toggleWishlist, setSearchQuery } from '@store/slices/customerPortalSlice';
import { customerApi, CustomerProduct } from '@services/customer.api';
import { useToast } from '@hooks/useToast';

export const CustomerDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { success } = useToast();

  const { user } = useAppSelector((state) => state.auth);
  const { wishlist, loyaltyPointsBalance, selectedBranch } = useAppSelector((state) => state.customerPortal);

  const [products, setProducts] = useState<CustomerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const data = await customerApi.getProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      dispatch(setSearchQuery(localSearch.trim()));
      navigate('/customer/shop');
    }
  };

  const handleAddToCart = (product: CustomerProduct) => {
    dispatch(addToCustomerCart({ product, quantity: 1 }));
    success(`Added ${product.name} to your basket!`);
  };

  const handleBuyNow = (product: CustomerProduct) => {
    dispatch(addToCustomerCart({ product, quantity: 1 }));
    navigate('/customer/checkout');
  };

  const quickActions = [
    { title: 'Shop Now', desc: 'Browse fresh catalog', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100', path: '/customer/shop' },
    { title: 'My Orders', desc: 'Track live delivery', icon: Package, color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100', path: '/customer/orders' },
    { title: 'Wishlist', desc: `${wishlist.length} saved products`, icon: Heart, color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100', path: '/customer/wishlist' },
    { title: 'Rewards', desc: 'Redeem vouchers', icon: Gift, color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100', path: '/customer/loyalty' },
    { title: 'Find Store', desc: selectedBranch, icon: MapPin, color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100', path: '/customer/stores' },
    { title: 'Weekend Deals', desc: '20% OFF sale', icon: Percent, color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100', path: '/customer/offers' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome & Search Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Welcome back to GroceryOS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Good afternoon, <span className="text-emerald-400">{user?.firstName || 'Kevin'}</span>! 👋
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            What would you like to stock up on today? Enjoy farm-fresh dairy, crispy bakery items, and fresh organic produce delivered in under 45 minutes.
          </p>

          {/* Search bar inside Hero */}
          <form onSubmit={handleSearch} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products, brands, or essentials..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-slate-900/80 backdrop-blur-md transition"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-2xl transition shadow-lg shrink-0 flex items-center justify-center gap-2"
            >
              Browse Catalog <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Decorative Floating Accent */}
        <div className="absolute right-6 -bottom-8 opacity-20 pointer-events-none hidden lg:block">
          <ShoppingBag className="w-80 h-80 text-emerald-400" />
        </div>
      </div>

      {/* Grid: Loyalty Card & Active Order Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loyalty Member Status Card */}
        <div className="lg:col-span-2 bg-linear-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-950 text-amber-300 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Gold Member
                </span>
                <span className="text-amber-900 text-xs font-semibold">Tier Rewards Active</span>
              </div>
              <h2 className="text-3xl font-black text-amber-950 mt-3">
                {loyaltyPointsBalance.toLocaleString()} <span className="text-lg font-bold text-amber-900">Points</span>
              </h2>
              <p className="text-xs text-amber-900 font-medium mt-1">
                550 points remaining until <span className="font-bold underline">Platinum Tier</span>
              </p>
            </div>

            <Link
              to="/customer/loyalty"
              className="bg-amber-950 hover:bg-black text-amber-100 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center gap-1.5 self-start"
            >
              <Gift className="h-3.5 w-3.5 text-amber-400" /> Redeem Rewards
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 space-y-2 mt-6">
            <div className="w-full bg-amber-900/20 rounded-full h-3 overflow-hidden p-0.5">
              <div className="bg-amber-950 h-full rounded-full transition-all duration-1000" style={{ width: '81%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] font-bold text-amber-950">
              <span>Gold (2,000 pts)</span>
              <span>81% Completed</span>
              <span>Platinum (3,000 pts)</span>
            </div>
          </div>

          {/* Quick Available Rewards chips */}
          <div className="relative z-10 pt-4 mt-4 border-t border-amber-600/30 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-amber-950">Available to Claim:</span>
            <span className="bg-white/70 backdrop-blur-xs text-amber-950 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-400/40">
              🎁 500 pts → KSh 50 Off
            </span>
            <span className="bg-white/70 backdrop-blur-xs text-amber-950 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-400/40">
              🎁 1,000 pts → KSh 120 Off
            </span>
          </div>
        </div>

        {/* Live Active Order Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-900">Active Order #ORD-10482</span>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
              Ready for Pickup
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-medium">
              Store: <span className="font-semibold text-slate-800">Kisii Main Branch</span>
            </p>
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Packed & ready at customer counter</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>Placed at 2:30 PM • 4 grocery items</span>
              </div>
            </div>
          </div>

          <Link
            to="/customer/orders"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl text-center transition flex items-center justify-center gap-1.5"
          >
            Track Order Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500" /> Quick Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.path}
                className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-md ${action.color}`}
              >
                <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-xs">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">{action.title}</h3>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recommended for You / Buy Again Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" /> Recommended For You
            </h2>
            <p className="text-xs text-slate-500 font-medium">Frequently purchased fresh essentials at {selectedBranch}</p>
          </div>
          <Link
            to="/customer/shop"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            View All Catalog <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => {
            const isWishlisted = wishlist.some((w) => w.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition flex flex-col group"
              >
                <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <button
                    onClick={() => dispatch(toggleWishlist(product))}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 backdrop-blur-xs rounded-full text-slate-600 hover:text-rose-500 shadow-xs transition"
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>
                  {product.tags?.[0] && (
                    <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {product.tags[0]}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{product.unit} • {product.brand}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">KSh {product.price}</span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through block">KSh {product.originalPrice}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs font-bold transition flex items-center justify-center"
                        title="Add to Basket"
                      >
                        <Plus className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleBuyNow(product)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-2 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1 whitespace-nowrap"
                        title="Instant Order & Pay"
                      >
                        <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" /> Order Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekend Banner Offer */}
      <div className="bg-linear-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-center sm:text-left">
          <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Coupon: GROCERY20
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold">20% OFF Weekend Fresh Grocery Blowout</h3>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-md">
            Save on whole milk, farm eggs, fresh tomatoes, and bakery specials across all Kisii & Nyamira branches.
          </p>
        </div>
        <Link
          to="/customer/offers"
          className="bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-sm px-6 py-3 rounded-2xl shadow-md transition whitespace-nowrap"
        >
          Claim Promo Code
        </Link>
      </div>
    </div>
  );
};
