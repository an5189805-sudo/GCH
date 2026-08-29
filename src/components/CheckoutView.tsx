import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Info,
  Bookmark,
  MapPin,
  Plus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserAddress, PaymentMethod, SavedAddress } from '../types';
import { ValidationService } from '../services/validationService';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartDiscount,
    cartTotal,
    storeConfig,
    currentUser,
    savedAddresses,
    saveAddress,
    placeOrder,
    goToCart,
    goToHome,
    showToast,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'review'>('details');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Address fields
  const [fullName, setFullName] = useState<string>(currentUser?.name || currentUser?.address?.fullName || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || currentUser?.address?.phone || '');
  const [email, setEmail] = useState<string>(currentUser?.email || currentUser?.address?.email || '');
  const [address, setAddress] = useState<string>(currentUser?.address?.address || '');
  const [city, setCity] = useState<string>(currentUser?.address?.city || 'Gujrat');
  const [area, setArea] = useState<string>(currentUser?.address?.area || '');
  const [postalCode, setPostalCode] = useState<string>(currentUser?.address?.postalCode || '');
  const [instructions, setInstructions] = useState<string>(currentUser?.address?.instructions || '');
  const [shouldSaveToAddressBook, setShouldSaveToAddressBook] = useState<boolean>(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  useEffect(() => {
    if (currentUser) {
      if (!fullName) setFullName(currentUser.name);
      if (!phone) setPhone(currentUser.phone);
      if (!email) setEmail(currentUser.email);
      if (currentUser.address) {
        if (!address) setAddress(currentUser.address.address);
        if (!city) setCity(currentUser.address.city);
        if (!area) setArea(currentUser.address.area);
        if (!postalCode) setPostalCode(currentUser.address.postalCode);
      }
    }
  }, [currentUser]);

  const handleSelectSavedAddress = (saved: SavedAddress) => {
    setFullName(saved.fullName);
    setPhone(saved.phone);
    setEmail(saved.email || email);
    setAddress(saved.address);
    setCity(saved.city);
    setArea(saved.area || '');
    setPostalCode(saved.postalCode || '');
    setInstructions(saved.instructions || '');
    showToast(`Loaded "${saved.label}" address.`);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 mx-auto text-stone-400 stroke-1" />
        <h2 className="font-serif-heading text-2xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="text-sm text-stone-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={goToHome}
          className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
        >
          Return to Collections
        </button>
      </div>
    );
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempAddress: Partial<UserAddress> = {
      fullName,
      phone,
      email,
      address,
      city,
      area,
      postalCode,
      instructions,
    };
    const validation = ValidationService.validateShippingAddress(tempAddress);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setErrorMessage(firstError || 'Please fill in all required delivery fields.');
      return;
    }
    setErrorMessage(null);
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    if (isSubmitting) return; // Prevent double click
    setIsSubmitting(true);
    setErrorMessage(null);

    const shippingAddress: UserAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      area: area.trim(),
      postalCode: postalCode.trim(),
      instructions: instructions.trim(),
    };

    // If user asked to save to address book
    if (shouldSaveToAddressBook && currentUser) {
      saveAddress({
        label: 'Home Address',
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        area: shippingAddress.area,
        postalCode: shippingAddress.postalCode,
        instructions: shippingAddress.instructions,
        isDefault: savedAddresses.length === 0,
      });
    }

    try {
      await placeOrder(shippingAddress, paymentMethod);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please check item stock.');
      setIsSubmitting(false);
    }
  };

  return (
    <div id="checkout-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goToCart}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900">
              Customer Checkout
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">Gondal Clothes House Secure Order Processing</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold">
          <span className={`px-3 py-1 rounded-xl ${step === 'details' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600'}`}>
            1. Delivery Address
          </span>
          <span className="text-stone-300">&rarr;</span>
          <span className={`px-3 py-1 rounded-xl ${step === 'payment' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600'}`}>
            2. Payment Method
          </span>
          <span className="text-stone-300">&rarr;</span>
          <span className={`px-3 py-1 rounded-xl ${step === 'review' ? 'bg-stone-900 text-white shadow-xs' : 'bg-stone-100 text-stone-600'}`}>
            3. Review & Place
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Interactive Flow */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Delivery Information */}
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-stone-900">
                  1. Customer & Delivery Information
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enter the recipient information and doorstep delivery address across Pakistan.
                </p>
              </div>

              {/* Saved Addresses quick-picker */}
              {currentUser && savedAddresses.length > 0 && (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>Choose from Saved Addresses:</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {savedAddresses.map((sa) => (
                      <button
                        key={sa.id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(sa)}
                        className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:border-stone-900 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <MapPin className="w-3 h-3 text-stone-500" />
                        <span>{sa.label}</span>
                        <span className="text-[10px] text-stone-400 font-normal">({sa.city})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="checkout-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Muhammad Ahmad Gondal"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number (WhatsApp Active) *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +92 300 1234567"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email / Gmail Address *
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ahmad.gondal@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Complete Street Address (House/Shop No, Street, Landmark) *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. House #14, Street 3, Model Town near Main Market"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    City *
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Gujrat / Lahore / Islamabad"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Area / Sector / Tehsil
                  </label>
                  <input
                    id="checkout-area"
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Cantt / City Center"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    id="checkout-postalcode"
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="e.g. 50700"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Additional Delivery Instructions (Optional)
                  </label>
                  <textarea
                    id="checkout-instructions"
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Call before arrival, leave with security..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden resize-none"
                  />
                </div>

                {currentUser && (
                  <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="save-address-checkbox"
                      checked={shouldSaveToAddressBook}
                      onChange={(e) => setShouldSaveToAddressBook(e.target.checked)}
                      className="w-4 h-4 rounded text-stone-900 border-stone-300 focus:ring-stone-900"
                    />
                    <label htmlFor="save-address-checkbox" className="text-xs text-stone-600 font-medium cursor-pointer">
                      Save this address to my account Address Book for fast 1-click checkout
                    </label>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  id="checkout-continue-payment-btn"
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Continue to Payment Options &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Method */}
          {step === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-stone-900">
                  2. Select Payment Method
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose how you would like to settle your clothing purchase.
                </p>
              </div>

              <div className="space-y-4">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-stone-900 bg-stone-50/70 shadow-2xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-stone-900 focus:ring-stone-900"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-amber-700" />
                      <span className="text-sm font-bold text-stone-900">Cash on Delivery (COD)</span>
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Pay in cash when your parcel is handed to you by the courier agent.
                    </p>
                  </div>
                </label>

                {/* Online Payment Preparation Interface */}
                <label
                  className={`flex items-start gap-4 p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-stone-900 bg-stone-50/70 shadow-2xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1 text-stone-900 focus:ring-stone-900"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-stone-700" />
                      <span className="text-sm font-bold text-stone-900">
                        Online Payment / Bank Transfer
                      </span>
                    </div>
                    <p className="text-xs text-stone-600">
                      Direct bank transfer / Card / EasyPaisa / JazzCash checkout integration.
                    </p>
                    <div className="p-2.5 bg-stone-100 rounded-xl text-[11px] text-stone-500 flex items-center gap-1.5 mt-2">
                      <Info className="w-3.5 h-3.5 text-stone-700 shrink-0" />
                      <span>Online payment credentials and gateway integration will be configured in Part 6.</span>
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  &larr; Back to Address
                </button>

                <button
                  id="checkout-continue-review-btn"
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-xs"
                >
                  Review Order Summary &rarr;
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Review & Place Order */}
          {step === 'review' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif-heading text-xl font-bold text-stone-900">
                  3. Order Review & Confirmation
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Verify your details before placing the order with Gondal Clothes House.
                </p>
              </div>

              {/* Delivery Details Recap */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-stone-200/60 pb-2">
                  <span className="font-bold text-stone-900">Recipient & Delivery Address</span>
                  <button
                    onClick={() => setStep('details')}
                    className="text-amber-700 font-semibold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-stone-800 font-semibold">{fullName}</p>
                <p className="text-stone-600">{phone} • {email}</p>
                <p className="text-stone-600">{address}, {city} {area ? `(${area})` : ''} {postalCode}</p>
                {instructions && (
                  <p className="text-stone-500 italic">Note: {instructions}</p>
                )}
              </div>

              {/* Payment Method Recap */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-stone-200/60 pb-2">
                  <span className="font-bold text-stone-900">Payment Selection</span>
                  <button
                    onClick={() => setStep('payment')}
                    className="text-amber-700 font-semibold hover:underline"
                  >
                    Change
                  </button>
                </div>
                <div className="flex items-center gap-2 text-stone-800 font-medium">
                  {paymentMethod === 'cod' ? (
                    <>
                      <Banknote className="w-4 h-4 text-amber-700" />
                      <span>Cash on Delivery (Pay upon parcel receipt)</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-stone-700" />
                      <span>Online Payment / Bank Transfer</span>
                    </>
                  )}
                </div>
              </div>

              {/* Final Place Order Action */}
              <div className="pt-4 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setStep('payment')}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  &larr; Back to Payment
                </button>

                <button
                  id="checkout-place-order-btn"
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  className="px-8 py-4 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>{isSubmitting ? 'Placing Order...' : 'Place Order Now'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Summary Column: Itemized Product Summary & Totals */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6 sticky top-28">
            <h3 className="font-serif-heading text-lg font-bold text-stone-900 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-stone-500">
                {cart.reduce((a, b) => a + b.quantity, 0)} Items
              </span>
            </h3>

            {/* Product List */}
            <div className="max-h-72 overflow-y-auto space-y-3 divide-y divide-stone-100">
              {cart.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                      {item.product.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 line-clamp-1">{item.product.title}</h4>
                      <p className="text-stone-500 text-[11px]">
                        {item.selectedSize} / {item.selectedColor} &times; {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-stone-900 shrink-0">
                    {storeConfig.currencySymbol} {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-stone-600 border-t border-stone-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  {storeConfig.currencySymbol} {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Discount</span>
                  <span>- {storeConfig.currencySymbol} {cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">Free</span>
                  ) : (
                    `${storeConfig.currencySymbol} ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-100">
                <span>Final Total</span>
                <span className="text-lg font-extrabold text-stone-900">
                  {storeConfig.currencySymbol} {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl text-[11px] text-stone-500 space-y-1">
              <p className="flex items-center gap-1.5 font-medium text-stone-700">
                <Truck className="w-3.5 h-3.5 text-stone-800" />
                <span>Nationwide Shipping by Gondal Clothes House</span>
              </p>
              <p>Estimated dispatch within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
