import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Heart,
  Store,
  Tag,
  Gift,
  Package,
  Home,
  Search,
  MapPin,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Phone,
  HelpCircle,
  Clock,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  X,
  Bell,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { logout } from '@store/slices/authSlice';
import {
  setSelectedBranch,
  setDeliveryType,
  removeFromCustomerCart,
  updateCustomerCartQuantity,
  setSearchQuery,
} from '@store/slices/customerPortalSlice';
import { cn } from '@utils/cn';

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { cart, wishlist, selectedBranch, deliveryType, loyaltyPointsBalance } = useAppSelector(
    (state) => state.customerPortal
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const branches = ['Kisii Main Branch', 'Kisii Town Branch', 'Nyamira Branch'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearchQuery(searchInput));
    if (location.pathname !== '/customer/shop') {
      navigate('/customer/shop');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const navLinks = [
    { label: 'Home', path: '/customer/dashboard', icon: Home },
    { label: 'Shop Groceries', path: '/customer/shop', icon: Store },
    { label: 'My Orders', path: '/customer/orders', icon: Package },
    { label: 'Loyalty & Rewards', path: '/customer/loyalty', icon: Gift },
    { label: 'Deals & Coupons', path: '/customer/offers', icon: Tag },
    { label: 'Store Locator', path: '/customer/stores', icon: MapPin },
    { label: 'Help & Support', path: '/customer/support', icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Banner: Service Announcement & Multi-branch status */}
      <div className="bg-emerald-800 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded font-medium text-[11px]">
              Same-day Fresh Delivery
            </span>
            <span>Order within the next 45 minutes for delivery by 6:00 PM today across Kisii & Nyamira.</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" /> 0700 000 000
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> Stores Open: 7:00 AM – 9:30 PM
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Portal Badge */}
          <Link to="/customer/dashboard" className="flex items-center gap-2.5 shrink-0 group">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:bg-emerald-700 transition">
              G
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">GroceryOS</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Customer Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Fresh Everyday • Kenyan Retail</p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search fresh milk, bread, tomatoes, coffee, snacks..."
                className="w-full pl-10 pr-24 py-2.5 bg-slate-100 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition shadow-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Branch & Delivery Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 border border-slate-200 p-1.5 rounded-xl text-xs">
            <div className="flex bg-white rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => dispatch(setDeliveryType('Delivery'))}
                className={cn(
                  'px-2.5 py-1 rounded-md font-semibold transition',
                  deliveryType === 'Delivery' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Delivery
              </button>
              <button
                onClick={() => dispatch(setDeliveryType('Pickup'))}
                className={cn(
                  'px-2.5 py-1 rounded-md font-semibold transition',
                  deliveryType === 'Pickup' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                Pickup
              </button>
            </div>

            <div className="flex items-center gap-1 text-slate-700 px-2 font-medium">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <select
                value={selectedBranch}
                onChange={(e) => dispatch(setSelectedBranch(e.target.value))}
                className="bg-transparent font-semibold text-slate-900 cursor-pointer focus:outline-none"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Loyalty Points Pill */}
            <Link
              to="/customer/loyalty"
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-full transition group"
            >
              <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500" />
              <div className="text-left leading-none">
                <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider">Gold Tier</span>
                <p className="text-xs font-extrabold text-amber-950">{loyaltyPointsBalance.toLocaleString()} pts</p>
              </div>
            </Link>

            {/* Wishlist Link */}
            <Link
              to="/customer/wishlist"
              className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
              title="My Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-sm font-semibold transition shadow-sm"
            >
              <div className="relative">
                <ShoppingCart className="h-4 w-4" />
                {cartTotalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-amber-950 text-[10px] font-extrabold h-4 w-4 rounded-full flex items-center justify-center border-2 border-emerald-600">
                    {cartTotalItems}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">KSh {cartSubtotal.toLocaleString()}</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
                  {user?.firstName?.[0] || 'K'}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/customer/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <User className="h-4 w-4" /> Profile & Addresses
                    </Link>

                    <Link
                      to="/customer/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <Package className="h-4 w-4" /> My Orders
                    </Link>

                    <Link
                      to="/customer/loyalty"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                    >
                      <Gift className="h-4 w-4 text-amber-500" /> Loyalty Program
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Category Navigation */}
        <div className="bg-slate-900 text-slate-200 overflow-x-auto scrollbar-hide">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition',
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Cart Drawer Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h3 className="font-bold text-base">Your Grocery Basket</h3>
                    <p className="text-xs text-slate-400">
                      {cartTotalItems} {cartTotalItems === 1 ? 'item' : 'items'} • {selectedBranch}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingCart className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-base">Your cart is empty</p>
                      <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                        Explore our fresh grocery catalog and add fresh milk, bread, produce and daily supplies.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/customer/shop');
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded-lg shrink-0 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="font-semibold text-xs text-slate-900 truncate">{item.product.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{item.product.unit}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-xs text-emerald-700">
                            KSh {(item.product.price * item.quantity).toLocaleString()}
                          </span>

                          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                            <button
                              onClick={() =>
                                dispatch(
                                  updateCustomerCartQuantity({
                                    productId: item.product.id,
                                    quantity: item.quantity - 1,
                                  })
                                )
                              }
                              className="p-1 text-slate-500 hover:text-slate-900"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() =>
                                dispatch(
                                  updateCustomerCartQuantity({
                                    productId: item.product.id,
                                    quantity: item.quantity + 1,
                                  })
                                )
                              }
                              className="p-1 text-slate-500 hover:text-slate-900"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => dispatch(removeFromCustomerCart(item.product.id))}
                        className="text-slate-400 hover:text-rose-500 p-1 self-start"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">KSh {cartSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 font-medium">
                    <span>Estimated Delivery ({deliveryType})</span>
                    <span className="font-bold text-emerald-600">
                      {deliveryType === 'Pickup' ? 'Free (Pickup)' : 'KSh 100'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Total Basket</span>
                    <span className="text-emerald-700">
                      KSh {(cartSubtotal + (deliveryType === 'Pickup' ? 0 : 100)).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/customer/cart');
                      }}
                      className="w-full bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs py-2.5 rounded-xl transition"
                    >
                      View Cart & Discounts
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/customer/checkout');
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                    >
                      Checkout <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                G
              </div>
              <span className="text-base font-bold text-white">GroceryOS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your neighborhood grocery platform. Farm-fresh fruits, vegetables, dairy, bakery, and household essentials
              delivered to your door.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-4 w-4" /> 100% Quality & Freshness Guarantee
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/customer/shop" className="hover:text-white transition">
                  Browse Online Catalog
                </Link>
              </li>
              <li>
                <Link to="/customer/loyalty" className="hover:text-white transition">
                  Gold Loyalty Program
                </Link>
              </li>
              <li>
                <Link to="/customer/offers" className="hover:text-white transition">
                  Weekend Deals & Coupons
                </Link>
              </li>
              <li>
                <Link to="/customer/orders" className="hover:text-white transition">
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Store Branches</h4>
            <ul className="space-y-2">
              <li>Kisii Main Branch - Hospital Road, Kisii CBD</li>
              <li>Kisii Town Branch - Town Square, Market St</li>
              <li>Nyamira Branch - Nyamira Plaza, Main Highway</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 text-sm">Supported Payments</h4>
            <p className="text-slate-400 mb-3">Instant checkout via Safaricom M-Pesa STK Push, Visa, Mastercard, and Cash on Delivery.</p>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <div className="h-6 px-2 bg-emerald-600 text-white font-bold text-[10px] rounded flex items-center">
                M-PESA
              </div>
              <span className="text-[11px] text-slate-300 font-medium">Official Daraja API STK Push</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 flex flex-wrap justify-between items-center gap-4 text-slate-500">
          <p>© 2026 GroceryOS Customer Portal. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <Link to="/customer/support" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link to="/customer/support" className="hover:text-slate-400">
              Terms of Service
            </Link>
            <Link to="/customer/support" className="hover:text-slate-400">
              Help Center
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
};
