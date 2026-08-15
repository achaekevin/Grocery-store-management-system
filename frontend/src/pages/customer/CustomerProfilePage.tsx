import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  CreditCard,
  Bell,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';
import { useAppSelector } from '@hooks/useAppSelector';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { setSelectedAddress } from '@store/slices/customerPortalSlice';
import { useToast } from '@hooks/useToast';

export const CustomerProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { success } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedAddress, selectedBranch, loyaltyPointsBalance } = useAppSelector(
    (state) => state.customerPortal
  );

  const [firstName, setFirstName] = useState(user?.firstName || 'Kevin');
  const [lastName, setLastName] = useState(user?.lastName || 'Omondi');
  const [email, setEmail] = useState(user?.email || 'customer@test.com');
  const [phone, setPhone] = useState(user?.phone || '0712345678');

  const [addresses, setAddresses] = useState([
    { id: 'addr_1', type: 'Home', address: 'Milimani Estate, House #14, Kisii', isDefault: true },
    { id: 'addr_2', type: 'Work', address: 'Kisii Business Complex, Floor 2, Market St', isDefault: false },
  ]);

  const [newAddressText, setNewAddressText] = useState('');
  const [newAddressType, setNewAddressType] = useState('Home');
  const [showAddAddress, setShowAddAddress] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    success('Customer profile details updated successfully!');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressText.trim()) return;

    const newAddr = {
      id: `addr_${Date.now()}`,
      type: newAddressType,
      address: newAddressText.trim(),
      isDefault: false,
    };
    setAddresses([...addresses, newAddr]);
    setNewAddressText('');
    setShowAddAddress(false);
    success('New delivery address saved!');
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    success('Address removed');
  };

  const handleSetDefault = (addr: any) => {
    dispatch(setSelectedAddress(addr.address));
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === addr.id,
      }))
    );
    success(`Default delivery address set to ${addr.type}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Customer Profile &amp; Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
          Manage your personal information, saved delivery addresses, and payment preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card & Personal Info Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="h-4 w-4 text-emerald-600" /> Personal Account Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (M-Pesa registered)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" /> Save Profile Changes
              </button>
            </div>
          </form>

          {/* Saved Addresses Section */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" /> Saved Delivery Addresses
              </h3>
              <button
                onClick={() => setShowAddAddress(!showAddAddress)}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Address
              </button>
            </div>

            {showAddAddress && (
              <form onSubmit={handleAddAddress} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label</label>
                    <select
                      value={newAddressType}
                      onChange={(e) => setNewAddressType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work / Office</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Street / Estate Address</label>
                    <input
                      type="text"
                      value={newAddressText}
                      onChange={(e) => setNewAddressText(e.target.value)}
                      placeholder="e.g. Milimani Estate, House #14, Kisii"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(false)}
                    className="px-3 py-1.5 rounded-xl border text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full">
                            Default Delivery Address
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{addr.address}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr)}
                        className="text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Account Membership & Preferences */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-amber-500 to-amber-700 text-amber-950 p-6 rounded-3xl shadow-lg space-y-4">
            <span className="bg-amber-950 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Gold Tier Status
            </span>
            <div>
              <h3 className="text-2xl font-black">{loyaltyPointsBalance.toLocaleString()} Points</h3>
              <p className="text-xs text-amber-900 font-medium">Linked Customer ID: CUST-00918</p>
            </div>
            <p className="text-xs text-amber-950/80 leading-relaxed">
              Enjoy 5% cashback on all dairy, bakery, and fresh farm produce across all Kenyan branches.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Preferences</h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between items-center">
                <span>Primary Branch</span>
                <span className="font-bold text-slate-900">{selectedBranch}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Preferred Payment</span>
                <span className="font-bold text-slate-900">Safaricom M-Pesa STK</span>
              </div>
              <div className="flex justify-between items-center">
                <span>SMS Receipt Delivery</span>
                <span className="font-bold text-emerald-600">Enabled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
