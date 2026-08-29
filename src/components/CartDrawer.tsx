import React from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
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

  if (!isCartDrawerOpen) return null;

  const freeDeliveryRemaining = Math.max(0, storeConfig.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / storeConfig.freeDeliveryThreshold) * 100));

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex justify-end"
      onClick={() => setIsCartDrawerOpen(false)}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="font-serif-heading font-bold text-lg text-stone-900">
              Shopping Cart
            </h2>
            <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 rounded-xl hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-100">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <Truck className="w-3.5 h-3.5 text-amber-600" />
              {freeDeliveryRemaining === 0 ? (
                <span className="text-emerald-700 font-bold">You qualify for FREE Delivery!</span>
              ) : (
                <span>
                  Add <span className="font-bold text-stone-900">{storeConfig.currencySymbol} {freeDeliveryRemaining.toLocaleString()}</span> more for Free Delivery
                </span>
              )}
            </span>
            <span className="font-bold text-[11px] text-stone-500">{freeDeliveryProgress}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                freeDeliveryRemaining === 0 ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div id="empty-cart-message" className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 stroke-1 text-stone-400" />
              </div>
              <h3 className="text-base font-bold text-stone-800">Your cart is empty.</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our catalog to find premium clothing and add your favorites to your bag.
              </p>
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  goToHome();
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/70"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    openProduct(item.productId);
                  }}
                  className="w-20 h-24 rounded-xl bg-stone-200 overflow-hidden shrink-0 cursor-pointer"
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

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        onClick={() => {
                          setIsCartDrawerOpen(false);
                          openProduct(item.productId);
                        }}
                        className="text-xs font-bold text-stone-900 hover:underline cursor-pointer line-clamp-1"
                      >
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-0.5"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                      <span>Size: <strong className="text-stone-700">{item.selectedSize}</strong></span>
                      <span>•</span>
                      <span>Color: <strong className="text-stone-700">{item.selectedColor}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-lg border border-stone-300 bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-stone-600 hover:text-stone-900 font-bold text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-stone-900">
                      {storeConfig.currencySymbol} {(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Summary & Checkout Footer */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">
                  {storeConfig.currencySymbol} {cartSubtotal.toLocaleString()}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between text-amber-700 font-medium">
                  <span>Special Discount</span>
                  <span>- {storeConfig.currencySymbol} {cartDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-semibold text-stone-900">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">Free</span>
                  ) : (
                    `${storeConfig.currencySymbol} ${deliveryFee.toLocaleString()}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                <span>Final Total</span>
                <span className="text-base font-extrabold text-stone-900">
                  {storeConfig.currencySymbol} {cartTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                id="cart-proceed-checkout-btn"
                onClick={goToCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2.5 text-center text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
