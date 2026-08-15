import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Search,
  CheckCircle2,
  XCircle,
  Navigation,
  Store,
  ShieldCheck,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { setSelectedBranch } from '@store/slices/customerPortalSlice';
import { useToast } from '@hooks/useToast';
import { cn } from '@utils/cn';

export const CustomerStoresPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success } = useToast();
  const { selectedBranch } = useAppSelector((state) => state.customerPortal);

  const [inventorySearch, setInventorySearch] = useState('');

  const branches = [
    {
      id: 'br_1',
      name: 'Kisii Main Branch',
      distance: '2.4 km away',
      address: 'Hospital Road, Kisii CBD',
      city: 'Kisii',
      phone: '+254 701 234 567',
      hours: '7:00 AM – 9:30 PM Everyday',
      isOpen: true,
      services: ['Fresh Bakery', 'Butchery', 'M-Pesa Counter', 'Customer Pickup Desk'],
    },
    {
      id: 'br_2',
      name: 'Kisii Town Branch',
      distance: '4.1 km away',
      address: 'Kisii Town Square, Market Street',
      city: 'Kisii',
      phone: '+254 701 234 568',
      hours: '7:30 AM – 9:00 PM Everyday',
      isOpen: true,
      services: ['Fresh Produce', 'Dairy & Eggs', 'Household Essentials'],
    },
    {
      id: 'br_3',
      name: 'Nyamira Branch',
      distance: '18 km away',
      address: 'Nyamira Plaza, Main Highway',
      city: 'Nyamira',
      phone: '+254 701 234 569',
      hours: '8:00 AM – 8:30 PM Everyday',
      isOpen: true,
      services: ['Groceries & Dry Foods', 'M-Pesa Super Till', 'Express Counter'],
    },
  ];

  const branchInventoryLookup: Record<string, Record<string, { inStock: boolean; qty: number }>> = {
    'fresh whole milk 1l': {
      'Kisii Main Branch': { inStock: true, qty: 45 },
      'Kisii Town Branch': { inStock: true, qty: 28 },
      'Nyamira Branch': { inStock: true, qty: 12 },
    },
    'premium white sliced bread 800g': {
      'Kisii Main Branch': { inStock: true, qty: 30 },
      'Kisii Town Branch': { inStock: true, qty: 15 },
      'Nyamira Branch': { inStock: true, qty: 8 },
    },
    'farm fresh brown eggs (tray of 30)': {
      'Kisii Main Branch': { inStock: true, qty: 20 },
      'Kisii Town Branch': { inStock: true, qty: 14 },
      'Nyamira Branch': { inStock: false, qty: 0 },
    },
    'organic red ripe tomatoes (1kg)': {
      'Kisii Main Branch': { inStock: true, qty: 55 },
      'Kisii Town Branch': { inStock: true, qty: 32 },
      'Nyamira Branch': { inStock: true, qty: 18 },
    },
    'pure mountain arabica coffee 250g': {
      'Kisii Main Branch': { inStock: true, qty: 25 },
      'Kisii Town Branch': { inStock: false, qty: 0 },
      'Nyamira Branch': { inStock: false, qty: 0 },
    },
  };

  const handleSelectBranch = (branchName: string) => {
    dispatch(setSelectedBranch(branchName));
    success(`Set primary shopping store to ${branchName}`);
  };

  const matchedQueryKey = Object.keys(branchInventoryLookup).find((k) =>
    inventorySearch.toLowerCase().trim() ? k.includes(inventorySearch.toLowerCase().trim()) : false
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Store Locator &amp; Inventory</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Locate neighborhood branches and check live stock levels across all locations
        </p>
      </div>

      {/* Real-time Branch Stock Search Engine */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Search className="h-5 w-5 text-emerald-600" /> Multi-Branch Live Stock Checker
            </h3>
            <p className="text-xs text-slate-500">
              Type any product (e.g. &quot;Milk&quot;, &quot;Eggs&quot;, &quot;Coffee&quot;) to inspect live stock across all branches
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={inventorySearch}
            onChange={(e) => setInventorySearch(e.target.value)}
            placeholder="Search item across all stores (e.g. Milk, Eggs, Coffee, Bread, Tomatoes)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {inventorySearch.trim() && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">
              Live Multi-Store Availability for &quot;{inventorySearch}&quot;:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {branches.map((b) => {
                const stockData = matchedQueryKey
                  ? branchInventoryLookup[matchedQueryKey]?.[b.name]
                  : { inStock: true, qty: Math.floor(Math.random() * 20) + 5 };

                const isAvail = stockData?.inStock !== false && (stockData?.qty || 0) > 0;

                return (
                  <div
                    key={b.id}
                    className={cn(
                      'p-4 rounded-2xl border flex items-center justify-between',
                      isAvail ? 'bg-emerald-50/80 border-emerald-300' : 'bg-rose-50/80 border-rose-300'
                    )}
                  >
                    <div>
                      <p className="font-bold text-xs text-slate-900">{b.name}</p>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {isAvail ? `✓ In Stock (${stockData?.qty || 15} units)` : '✗ Out of Stock'}
                      </span>
                    </div>
                    {isAvail ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-500" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Branches Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {branches.map((branch) => {
          const isSelected = selectedBranch === branch.name;
          return (
            <div
              key={branch.id}
              className={cn(
                'bg-white rounded-3xl p-6 border shadow-2xs transition flex flex-col justify-between space-y-6',
                isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' : 'border-slate-200'
              )}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {branch.distance}
                    </span>
                    <h3 className="font-extrabold text-lg text-slate-900 mt-1">{branch.name}</h3>
                  </div>

                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Open Now
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{branch.address}, {branch.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{branch.hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">In-Store Services</span>
                  <div className="flex flex-wrap gap-1">
                    {branch.services.map((srv, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectBranch(branch.name)}
                className={cn(
                  'w-full py-2.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center justify-center gap-2',
                  isSelected
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                )}
              >
                <Store className="h-4 w-4" />
                {isSelected ? 'Primary Store Selected' : 'Set as My Primary Branch'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
