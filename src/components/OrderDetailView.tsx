import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';
import { Order } from '../types';
import {
  ArrowLeft,
  Printer,
  Truck,
  MessageSquare,
  Ban,
  MapPin,
  ShieldCheck,
  Package,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { OrderReceiptModal } from './OrderReceiptModal';

export const OrderDetailView: React.FC = () => {
  const {
    selectedOrderId,
    storeConfig,
    cancelOrder,
    openOrderTracking,
    goToAccount,
    goToContact,
    openProduct,
    showToast,
  } = useStore();

  const [order, setOrder] = useState<Order | undefined>(() => {
    if (selectedOrderId) {
      return storeService.getOrderById(selectedOrderId);
    }
    return undefined;
  });

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  React.useEffect(() => {
    if (selectedOrderId) {
      setOrder(storeService.getOrderById(selectedOrderId));
    }
  }, [selectedOrderId]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Order Not Found</h2>
        <p className="text-xs text-stone-500">
          The requested order details could not be located. Please check your account order list.
        </p>
        <button
          type="button"
          onClick={goToAccount}
          className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
        >
          Return to My Account
        </button>
      </div>
    );
  }

  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  const handleConfirmCancel = async () => {
    try {
      setIsCancelling(true);
      const cancelled = await cancelOrder(order.id, cancelReason);
      setOrder(cancelled);
      setIsCancelModalOpen(false);
      setCancelReason('');
    } catch (err: any) {
      showToast(err.message || 'Could not cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div id="order-detail-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <button
            type="button"
            onClick={goToAccount}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-950">
              Order {order.orderNumber}
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                order.status === 'delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : order.status === 'shipped'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Placed on {formattedDate}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => openOrderTracking(order.id)}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Progress</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReceiptOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Receipt</span>
          </button>

          <button
            type="button"
            onClick={() => goToContact(order.orderNumber)}
            className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-stone-500" />
            <span>Contact Store</span>
          </button>

          {canCancel && (
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Order</span>
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Banner if Cancelled */}
      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-5 text-red-900 flex items-start gap-3">
          <Ban className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">This order was cancelled.</p>
            <p className="text-red-700">Reason: {order.cancellationReason || 'Requested by customer'}</p>
          </div>
        </div>
      )}

      {/* Items Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
          <Package className="w-4 h-4 text-stone-500" />
          <span>Garments in this Order ({order.items.length})</span>
        </h2>

        <div className="divide-y divide-stone-100">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-20 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0 cursor-pointer"
                  onClick={() => openProduct(item.productId)}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="space-y-1 text-xs">
                  <h3
                    className="font-bold text-stone-900 text-sm hover:underline cursor-pointer"
                    onClick={() => openProduct(item.productId)}
                  >
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-stone-500">
                    <span>Size: <strong className="text-stone-800">{item.size}</strong></span>
                    {item.color && item.color !== 'Standard' && (
                      <span>• Color: <strong className="text-stone-800">{item.color}</strong></span>
                    )}
                  </div>
                  <p className="text-stone-500">
                    Quantity: <strong className="text-stone-800">{item.quantity}</strong> × {storeConfig.currencySymbol} {item.unitPrice.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="sm:text-right text-xs">
                <span className="text-stone-500 block">Item Total</span>
                <span className="font-bold text-sm text-stone-900">
                  {storeConfig.currencySymbol} {item.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipient & Payment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient & Shipping info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-3">
            <MapPin className="w-4 h-4 text-stone-500" />
            <span>Delivery Destination</span>
          </div>

          <div className="text-xs text-stone-600 space-y-2">
            <div>
              <span className="text-[11px] text-stone-400 uppercase font-semibold block">Recipient</span>
              <p className="font-bold text-stone-900 text-sm">{order.customerName}</p>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 uppercase font-semibold block">Contact Number</span>
              <p className="text-stone-800 font-medium">{order.customerPhone}</p>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 uppercase font-semibold block">Address</span>
              <p className="text-stone-800">{order.shippingAddress.address}</p>
              <p className="text-stone-800">
                {order.shippingAddress.area ? `${order.shippingAddress.area}, ` : ''}
                {order.shippingAddress.city}
                {order.shippingAddress.postalCode ? ` - ${order.shippingAddress.postalCode}` : ''}
              </p>
            </div>
            {order.shippingAddress.instructions && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-[11px] text-stone-600">
                <span className="font-bold text-stone-800 block mb-0.5">Special Instructions:</span>
                {order.shippingAddress.instructions}
              </div>
            )}
          </div>
        </div>

        {/* Pricing & Payment Method */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700 border-b border-stone-100 pb-3">
            <ShieldCheck className="w-4 h-4 text-stone-500" />
            <span>Payment Summary</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>{storeConfig.currencySymbol} {order.subtotal.toLocaleString()}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount Applied:</span>
                <span>-{storeConfig.currencySymbol} {order.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee:</span>
              <span>
                {order.deliveryFee === 0
                  ? 'FREE'
                  : `${storeConfig.currencySymbol} ${order.deliveryFee.toLocaleString()}`}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-stone-950 border-t border-stone-200 pt-3">
              <span>Grand Total:</span>
              <span>{storeConfig.currencySymbol} {order.total.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 mt-4 text-[11px] text-stone-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Payment via: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div
          id="cancel-order-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-stone-200 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-stone-900">
                Cancel Order #{order.orderNumber}?
              </h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to cancel this order?
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Reason for cancellation:
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Ordered wrong size, changed mind..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-stone-900 resize-none"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(false)}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Order Receipt */}
      <OrderReceiptModal
        order={order}
        storeConfig={storeConfig}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
};
