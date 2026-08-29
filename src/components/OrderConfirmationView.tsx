import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  User,
  ShoppingBag,
  Clock,
  Printer,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';

export const OrderConfirmationView: React.FC = () => {
  const { selectedOrderId, storeConfig, goToHome, goToAccount, setActiveView } = useStore();

  const order = React.useMemo(() => {
    if (!selectedOrderId) {
      const allOrders = storeService.getOrders();
      return allOrders[0] || null;
    }
    return storeService.getOrderById(selectedOrderId) || null;
  }, [selectedOrderId]);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-12 h-12 mx-auto text-stone-400 stroke-1" />
        <h2 className="font-serif-heading text-2xl font-bold text-stone-900">Order Details Unavailable</h2>
        <p className="text-sm text-stone-500">We could not retrieve this order receipt.</p>
        <button
          onClick={goToHome}
          className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
        >
          Return to Store Home
        </button>
      </div>
    );
  }

  return (
    <div id="order-confirmation-page" className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3 bg-stone-900 text-white p-8 sm:p-12 rounded-3xl relative overflow-hidden shadow-lg">
        <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 mx-auto flex items-center justify-center mb-2 shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
          Order Successfully Placed
        </span>
        <h1 className="font-serif-heading text-2xl sm:text-4xl font-bold">
          Thank you, {order.customerName}!
        </h1>
        <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Your order has been recorded. Our store team is preparing your attire for dispatch.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800/80 border border-stone-700 text-xs font-mono font-bold mt-2">
          <span>Order Reference:</span>
          <span className="text-amber-400">{order.orderNumber}</span>
        </div>
      </div>

      {/* Main Receipt Content */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="font-serif-heading text-lg font-bold text-stone-900">
              Order Receipt & Details
            </h2>
            <p className="text-xs text-stone-500">
              Placed on {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900">
              <Clock className="w-3.5 h-3.5" />
              Status: {order.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Recipient & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs">
          <div>
            <span className="font-bold text-stone-900 block mb-1">Delivery Address</span>
            <p className="font-semibold text-stone-800">{order.shippingAddress.fullName}</p>
            <p className="text-stone-600">{order.shippingAddress.address}</p>
            <p className="text-stone-600">
              {order.shippingAddress.city}, {order.shippingAddress.area} {order.shippingAddress.postalCode}
            </p>
            {order.shippingAddress.instructions && (
              <p className="text-stone-500 italic mt-1">Instructions: {order.shippingAddress.instructions}</p>
            )}
          </div>

          <div>
            <span className="font-bold text-stone-900 block mb-1">Contact & Payment</span>
            <p className="text-stone-700">Phone: {order.shippingAddress.phone}</p>
            <p className="text-stone-700">Email: {order.shippingAddress.email}</p>
            <div className="mt-2 pt-2 border-t border-stone-200">
              <span className="font-semibold text-stone-900">Payment: </span>
              <span className="text-stone-700">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery (Pay upon arrival)' : 'Online Payment'}
              </span>
            </div>
          </div>
        </div>

        {/* Itemized Products */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Items in Order ({order.items.length})
          </h3>
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{item.title}</h4>
                    <p className="text-stone-500 text-[11px]">
                      Size: <strong>{item.size}</strong> • Color: <strong>{item.color}</strong> • Qty: <strong>{item.quantity}</strong>
                    </p>
                  </div>
                </div>

                <span className="font-bold text-stone-900">
                  {storeConfig.currencySymbol} {item.totalPrice.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs text-stone-600 max-w-sm ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-stone-900">
              {storeConfig.currencySymbol} {order.subtotal.toLocaleString()}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-amber-700 font-medium">
              <span>Discount</span>
              <span>- {storeConfig.currencySymbol} {order.discount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-semibold text-stone-900">
              {order.deliveryFee === 0 ? (
                <span className="text-emerald-700 font-bold uppercase">Free</span>
              ) : (
                `${storeConfig.currencySymbol} ${order.deliveryFee.toLocaleString()}`
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
            <span>Total Payable</span>
            <span className="text-base font-extrabold text-stone-900">
              {storeConfig.currencySymbol} {order.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-stone-100">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={goToAccount}
              className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>View in Account</span>
            </button>

            <button
              onClick={goToHome}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
