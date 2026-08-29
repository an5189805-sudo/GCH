import React from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    cartDiscount,
    cartTotal,
    storeConfig,
    removeFromCart,
    updateCartQuantity,
    goToCheckout,
    goToHome,
    openProduct,
  } = useStore();

  const freeDeliveryRemaining = Math.max(0, storeConfig.freeDeliveryThreshold - cartSubtotal);

  if (cart.length === 0) {
    return (
      <div id="full-cart-empty-view" className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 stroke-1 text-stone-500" />
        </div>
        <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900">
          Your cart is empty.
        </h2>
        <p className="text-sm text-stone-500 max-w-md mx-auto">
          You haven&apos;t added any clothing items to your shopping cart yet. Discover our collection of fine apparel.
        </p>
        <div className="pt-4">
          <button
            onClick={goToHome}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="cart-page-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <h1 className="font-serif-heading text-3xl font-bold text-stone-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review your selected items and quantities before proceeding to secure checkout.
          </p>
        </div>

        <button
          onClick={goToHome}
          className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs"
            >
              <div className="flex items-center gap-4">
                <div
                  onClick={() => openProduct(item.productId)}
                  className="w-20 h-24 rounded-xl bg-stone-100 overflow-hidden shrink-0 cursor-pointer"
                >
                  {item.product.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <ShoppingBag className="w-6 h-6 stroke-1" />
                    </div>
                  )}
                </div>

                <div>
                  <h3
                    onClick={() => openProduct(item.productId)}
                    className="text-sm font-bold text-stone-900 hover:underline cursor-pointer"
                  >
                    {item.product.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                    <span>Size: <strong className="text-stone-700">{item.selectedSize}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-stone-700">{item.selectedColor}</strong></span>
                  </div>
                  <div className="text-xs font-semibold text-stone-900 mt-2">
                    {storeConfig.currencySymbol} {item.unitPrice.toLocaleString()} each
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <div className="flex items-center rounded-xl border border-stone-300 bg-stone-50">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-2 text-stone-600 hover:text-stone-900 font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <span className="text-sm font-bold text-stone-900 block">
                    {storeConfig.currencySymbol} {(item.unitPrice * item.quantity).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-stone-100 transition-colors"
                  title="Remove from Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4">
          <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6 sticky top-28">
            <h3 className="font-serif-heading text-lg font-bold text-stone-900">
              Order Summary
            </h3>

            {/* Delivery Alert */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-stone-600 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-stone-900 shrink-0 mt-0.5" />
              <div>
                {freeDeliveryRemaining === 0 ? (
                  <span className="text-emerald-700 font-bold">Free Nationwide Delivery Applied</span>
                ) : (
                  <span>
                    Add <strong>{storeConfig.currencySymbol} {freeDeliveryRemaining.toLocaleString()}</strong> more to get Free Delivery.
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs text-stone-600 border-b border-stone-100 pb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  {storeConfig.currencySymbol} {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Product Savings</span>
                  <span>- {storeConfig.currencySymbol} {cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charges</span>
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

            <button
              onClick={goToCheckout}
              className="w-full py-4 px-4 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
              <span>Cash on Delivery & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
