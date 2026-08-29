import React, { useState, useMemo } from 'react';
import {
  User as UserIcon,
  LogOut,
  Package,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Save,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';
import { UserAddress, Order } from '../types';

export const AccountView: React.FC = () => {
  const {
    currentUser,
    login,
    register,
    logout,
    updateContactInfo,
    storeConfig,
    openProduct,
    setSelectedOrderId,
    setActiveView,
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authName, setAuthName] = useState<string>('');
  const [authPhone, setAuthPhone] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

  // Active sub-tab in account dashboard
  const [accountTab, setAccountTab] = useState<'orders' | 'contact' | 'profile'>('orders');

  // Contact / Address form state
  const [contactName, setContactName] = useState<string>(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState<string>(currentUser?.phone || '');
  const [contactEmail, setContactEmail] = useState<string>(currentUser?.email || '');
  const [contactAddress, setContactAddress] = useState<string>(currentUser?.address?.address || '');
  const [contactCity, setContactCity] = useState<string>(currentUser?.address?.city || 'Gujrat');
  const [contactArea, setContactArea] = useState<string>(currentUser?.address?.area || '');
  const [contactPostalCode, setContactPostalCode] = useState<string>(currentUser?.address?.postalCode || '');
  const [contactInstructions, setContactInstructions] = useState<string>(currentUser?.address?.instructions || '');
  const [isSavingContact, setIsSavingContact] = useState<boolean>(false);

  // Selected Order for detail modal
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Customer orders list
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    return storeService.getCustomerOrders(currentUser.email || currentUser.id);
  }, [currentUser]);

  // Sync state when currentUser updates
  React.useEffect(() => {
    if (currentUser) {
      setContactName(currentUser.name || '');
      setContactPhone(currentUser.phone || '');
      setContactEmail(currentUser.email || '');
      if (currentUser.address) {
        setContactAddress(currentUser.address.address || '');
        setContactCity(currentUser.address.city || 'Gujrat');
        setContactArea(currentUser.address.area || '');
        setContactPostalCode(currentUser.address.postalCode || '');
        setContactInstructions(currentUser.address.instructions || '');
      }
    }
  }, [currentUser]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      await login(authEmail);
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthLoading(true);
    try {
      await register(authName, authEmail, authPhone, authPassword);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      const addressData: UserAddress = {
        fullName: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
        address: contactAddress.trim(),
        city: contactCity.trim(),
        area: contactArea.trim(),
        postalCode: contactPostalCode.trim(),
        instructions: contactInstructions.trim(),
      };
      updateContactInfo(addressData);
    } finally {
      setIsSavingContact(false);
    }
  };

  // If NOT logged in, show clean Customer Auth
  if (!currentUser) {
    return (
      <div id="customer-auth-container" className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-white mx-auto flex items-center justify-center font-serif font-bold text-lg">
              G
            </div>
            <h1 className="font-serif-heading text-2xl font-bold text-stone-900">
              Customer Account
            </h1>
            <p className="text-xs text-stone-500">
              Sign in to manage your addresses, saved contacts, and track orders.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthError(null);
              }}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'login' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setAuthError(null);
              }}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'register' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {authError}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email / Gmail Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50"
              >
                {isAuthLoading ? 'Signing In...' : 'Sign In to Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Tariq Gondal"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email / Gmail Address *
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="tariq@gmail.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthLoading}
                className="w-full py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50"
              >
                {isAuthLoading ? 'Creating Account...' : 'Complete Registration'}
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-[11px] text-stone-400">
            <span>Secure Customer Portal • Gondal Clothes House</span>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Customer Dashboard
  return (
    <div id="customer-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Profile Summary Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 text-white flex items-center justify-center text-xl font-bold font-serif shadow-xs">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-serif-heading text-xl sm:text-2xl font-bold text-stone-900">
              {currentUser.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                {currentUser.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                {currentUser.phone}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setAccountTab('orders')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            accountTab === 'orders'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setAccountTab('contact')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            accountTab === 'contact'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Add / Update Contact</span>
        </button>

        <button
          onClick={() => setAccountTab('profile')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            accountTab === 'profile'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Overview</span>
        </button>
      </div>

      {/* TAB 1: Orders History */}
      {accountTab === 'orders' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <Package className="w-7 h-7 stroke-1 text-stone-500" />
              </div>
              <h3 className="text-base font-bold text-stone-800">No orders placed yet.</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                When you purchase clothing from Gondal Clothes House, your tracking and receipts will appear here.
              </p>
              <button
                onClick={() => setActiveView('home')}
                className="mt-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900 font-mono">
                          {ord.orderNumber}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-900">
                          {ord.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-stone-900">
                        {storeConfig.currencySymbol} {ord.total.toLocaleString()}
                      </span>
                      <button
                        onClick={() => setViewingOrder(ord)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Summary of items */}
                  <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                    {ord.items.map((it, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/80"
                      >
                        {it.title} ({it.size} / {it.color}) &times; {it.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Add / Update Contact Feature */}
      {accountTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6 max-w-2xl">
          <div>
            <h2 className="font-serif-heading text-xl font-bold text-stone-900">
              Customer Contact & Address Information
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Save your primary contact numbers and shipping destination for swift 1-click checkout.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Gmail / Email
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Complete Street Address
              </label>
              <input
                type="text"
                required
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="House / Plaza, Street, Landmark"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City
              </label>
              <input
                type="text"
                required
                value={contactCity}
                onChange={(e) => setContactCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Area / District
              </label>
              <input
                type="text"
                value={contactArea}
                onChange={(e) => setContactArea(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={contactPostalCode}
                onChange={(e) => setContactPostalCode(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Delivery Instructions
              </label>
              <textarea
                rows={2}
                value={contactInstructions}
                onChange={(e) => setContactInstructions(e.target.value)}
                placeholder="Specific delivery guidelines"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingContact}
              className="px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-4 h-4 text-amber-400" />
              <span>{isSavingContact ? 'Saving...' : 'Save Contact Details'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Profile Information */}
      {accountTab === 'profile' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6 max-w-2xl text-xs text-stone-600">
          <div>
            <h2 className="font-serif-heading text-xl font-bold text-stone-900">
              Customer Profile Details
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">Account security & registration timestamp.</p>
          </div>

          <div className="space-y-3 divide-y divide-stone-100">
            <div className="pt-2 flex justify-between">
              <span className="font-semibold text-stone-700">Account ID:</span>
              <span className="font-mono text-stone-900">{currentUser.id}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="font-semibold text-stone-700">Member Since:</span>
              <span className="text-stone-900">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="font-semibold text-stone-700">Authentication:</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer Session
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="font-serif-heading font-bold text-base text-stone-900">
                  Order {viewingOrder.orderNumber}
                </h3>
                <p className="text-xs text-stone-500">
                  Placed {new Date(viewingOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 text-stone-500 hover:text-stone-900 rounded-xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-stone-50 rounded-2xl space-y-1">
                <span className="font-bold text-stone-900 block">Shipping Recipient</span>
                <p>{viewingOrder.shippingAddress.fullName} • {viewingOrder.shippingAddress.phone}</p>
                <p>{viewingOrder.shippingAddress.address}, {viewingOrder.shippingAddress.city}</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-stone-900 block">Products Ordered</span>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                  {viewingOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-stone-900 block">{it.title}</span>
                        <span className="text-stone-500 text-[11px]">
                          {it.size} / {it.color} &times; {it.quantity}
                        </span>
                      </div>
                      <span className="font-bold text-stone-900">
                        {storeConfig.currencySymbol} {it.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between text-sm font-bold text-stone-900 border-t border-stone-100">
                <span>Total Amount:</span>
                <span>{storeConfig.currencySymbol} {viewingOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50 flex justify-end">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
