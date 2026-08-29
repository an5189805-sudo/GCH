import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';
import { Order, OrderStatus } from '../types';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Ban,
  ArrowLeft,
  Printer,
  MessageSquare,
  AlertCircle,
  MapPin,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';
import { OrderReceiptModal } from './OrderReceiptModal';

const TIMELINE_STEPS: { status: OrderStatus; label: string; description: string }[] = [
  {
    status: 'pending',
    label: 'Order Placed',
    description: 'We have received your order details.',
  },
  {
    status: 'confirmed',
    label: 'Order Confirmed',
    description: 'Garments verified and approved for fulfillment.',
  },
  {
    status: 'processing',
    label: 'Processing & Tailoring',
    description: 'Quality inspection, pressing, and premium packaging.',
  },
  {
    status: 'shipped',
    label: 'Dispatched / In Transit',
    description: 'Handed over to courier service for nationwide delivery.',
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Delivered safely to your destination address.',
  },
];

export const OrderTrackingView: React.FC = () => {
  const {
    selectedOrderId,
    setSelectedOrderId,
    storeConfig,
    cancelOrder,
    goToHome,
    goToAccount,
    goToContact,
    showToast,
  } = useStore();

  const [lookupId, setLookupId] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | undefined>(() => {
    if (selectedOrderId) {
      return storeService.getOrderById(selectedOrderId);
    }
    return undefined;
  });

  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Sync if selectedOrderId changes
  React.useEffect(() => {
    if (selectedOrderId) {
      const ord = storeService.getOrderById(selectedOrderId);
      setActiveOrder(ord);
    }
  }, [selectedOrderId]);

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    const found = storeService.getOrderById(lookupId.trim());
    if (found) {
      setActiveOrder(found);
      setSelectedOrderId(found.id);
    } else {
      showToast('No order found matching this Order Number or ID.');
    }
  };

  const handleConfirmCancel = async () => {
    if (!activeOrder) return;
    try {
      setIsCancelling(true);
      const cancelled = await cancelOrder(activeOrder.id, cancelReason);
      setActiveOrder(cancelled);
      setIsCancelModalOpen(false);
      setCancelReason('');
    } catch (err: any) {
      showToast(err.message || 'Could not cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Status index calculation
  const getStepStatus = (stepIndex: number, currentStatus: OrderStatus) => {
    if (currentStatus === 'cancelled') return 'cancelled';
    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const canCancel = activeOrder && (activeOrder.status === 'pending' || activeOrder.status === 'confirmed');

  return (
    <div id="order-tracking-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <button
            type="button"
            onClick={goToAccount}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Orders</span>
          </button>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-950">
            Track Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time status updates for your Gondal Clothes House shipments.
          </p>
        </div>

        {/* Search Order Bar if user wants to look up another order */}
        <form onSubmit={handleSearchOrder} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="e.g. GCH-2026-0001"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-stone-900 bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {!activeOrder ? (
        /* Empty / No order selected state */
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-stone-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-stone-900">Enter Your Order Number</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Please enter your order reference number above (e.g. GCH-2026-0001) or check your order history in the account section to inspect delivery progression.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={goToAccount}
              className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Go to My Orders
            </button>
            <button
              type="button"
              onClick={goToHome}
              className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        /* Active Order Tracking Display */
        <div className="space-y-6">
          {/* Order Header Summary Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-sm font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-xl">
                  {activeOrder.orderNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    activeOrder.status === 'delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : activeOrder.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : activeOrder.status === 'shipped'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {activeOrder.status}
                </span>
              </div>

              <p className="text-xs text-stone-500">
                Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsReceiptOpen(true)}
                className="px-3.5 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-stone-500" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={() => goToContact(activeOrder.orderNumber)}
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

          {/* Cancellation Notice if Cancelled */}
          {activeOrder.status === 'cancelled' && (
            <div className="bg-red-50 border border-red-200 rounded-3xl p-5 sm:p-6 text-red-900 flex items-start gap-4">
              <Ban className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="font-bold">This order has been cancelled.</p>
                <p className="text-red-700">
                  {activeOrder.cancellationReason || 'Cancelled upon customer request.'}
                </p>
                <p className="text-[11px] text-red-600">
                  If this was a mistake or you have questions, please reach out via our contact page.
                </p>
              </div>
            </div>
          )}

          {/* Visual Order Timeline (Mobile & Desktop friendly) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              Delivery Progress Timeline
            </h2>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 space-y-8 my-4 ml-3 sm:ml-4">
              {TIMELINE_STEPS.map((step, idx) => {
                const stepState = getStepStatus(idx, activeOrder.status);

                return (
                  <div key={step.status} className="relative group">
                    {/* Circle Indicator on the line */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                        stepState === 'completed'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : stepState === 'current'
                          ? 'bg-stone-900 text-white ring-4 ring-amber-100 ring-offset-2'
                          : stepState === 'cancelled'
                          ? 'bg-stone-200 text-stone-400'
                          : 'bg-stone-100 text-stone-400 border border-stone-300'
                      }`}
                    >
                      {stepState === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : stepState === 'current' ? (
                        <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
                      ) : (
                        <span className="text-[10px] sm:text-xs font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-xs sm:text-sm font-bold ${
                            stepState === 'completed' || stepState === 'current'
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </h3>

                        {stepState === 'current' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                            In Progress
                          </span>
                        )}
                        {stepState === 'completed' && (
                          <span className="text-[11px] font-medium text-emerald-700">
                            Completed
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs ${
                          stepState === 'completed' || stepState === 'current'
                            ? 'text-stone-600'
                            : 'text-stone-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Destination & Item Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <MapPin className="w-4 h-4 text-stone-500" />
                <span>Shipping Address</span>
              </div>

              <div className="text-xs text-stone-600 space-y-1.5">
                <p className="font-semibold text-stone-900 text-sm">{activeOrder.customerName}</p>
                <p className="text-stone-700">{activeOrder.shippingAddress.address}</p>
                <p className="text-stone-700">
                  {activeOrder.shippingAddress.area ? `${activeOrder.shippingAddress.area}, ` : ''}
                  {activeOrder.shippingAddress.city}
                  {activeOrder.shippingAddress.postalCode ? ` - ${activeOrder.shippingAddress.postalCode}` : ''}
                </p>
                <p className="pt-1 text-stone-500">Contact: {activeOrder.customerPhone}</p>
                {activeOrder.shippingAddress.instructions && (
                  <div className="p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-600 border border-stone-100">
                    <span className="font-semibold text-stone-700">Instructions: </span>
                    {activeOrder.shippingAddress.instructions}
                  </div>
                )}
              </div>
            </div>

            {/* Payment & Charges Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                <FileText className="w-4 h-4 text-stone-500" />
                <span>Payment & Totals</span>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>{storeConfig.currencySymbol} {activeOrder.subtotal.toLocaleString()}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-{storeConfig.currencySymbol} {activeOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Nationwide Delivery:</span>
                  <span>
                    {activeOrder.deliveryFee === 0
                      ? 'FREE'
                      : `${storeConfig.currencySymbol} ${activeOrder.deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-100 pt-2">
                  <span>Total Amount:</span>
                  <span>{storeConfig.currencySymbol} {activeOrder.total.toLocaleString()}</span>
                </div>
                <div className="pt-2 text-[11px] text-stone-500">
                  Payment Method: <span className="font-semibold text-stone-800">{activeOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items Preview */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Ordered Garments ({activeOrder.items.length})
            </h3>
            <div className="divide-y divide-stone-100">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-4">
                  <div className="w-14 h-16 rounded-xl bg-stone-100 border border-stone-200 overflow-hidden shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-stone-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-semibold text-stone-900 truncate">{item.title}</h4>
                    <p className="text-stone-500">
                      Size: <span className="text-stone-800 font-medium">{item.size}</span>
                      {item.color && item.color !== 'Standard' && (
                        <span> | Color: <span className="text-stone-800 font-medium">{item.color}</span></span>
                      )}
                    </p>
                    <p className="text-stone-500">
                      Qty: {item.quantity} × {storeConfig.currencySymbol} {item.unitPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right text-xs font-semibold text-stone-900">
                    {storeConfig.currencySymbol} {item.totalPrice.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {isCancelModalOpen && activeOrder && (
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
                Cancel Order #{activeOrder.orderNumber}?
              </h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to cancel this order? This action will mark your order as cancelled and restore the reserved inventory.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Reason for cancellation (optional):
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

      {/* Printable Receipt Modal */}
      {activeOrder && (
        <OrderReceiptModal
          order={activeOrder}
          storeConfig={storeConfig}
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}
    </div>
  );
};
