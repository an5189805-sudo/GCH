import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Order, StoreConfig } from '../types';

interface OrderReceiptModalProps {
  order: Order;
  storeConfig: StoreConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderReceiptModal: React.FC<OrderReceiptModalProps> = ({
  order,
  storeConfig,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      id="order-receipt-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="printable-order-receipt"
        className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200 text-stone-900 space-y-6 max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span>Official Customer Order Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="font-serif-heading text-2xl font-bold tracking-tight text-stone-950">
              {storeConfig.storeName}
            </div>
            <div className="text-xs text-stone-500 font-medium">{storeConfig.tagline}</div>
            <div className="text-xs text-stone-500 mt-2 space-y-0.5">
              <p>{storeConfig.address}</p>
              <p>{storeConfig.city}, {storeConfig.country}</p>
              <p>Phone: {storeConfig.phone} | Email: {storeConfig.email}</p>
            </div>
          </div>

          <div className="sm:text-right space-y-1">
            <div className="inline-block px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-mono text-xs font-bold">
              {order.orderNumber}
            </div>
            <div className="text-xs text-stone-500 font-medium">Date: {formattedDate}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Status: {order.status}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
          <div>
            <span className="font-bold text-stone-800 uppercase tracking-wider block mb-1">
              Customer Information
            </span>
            <p className="font-semibold text-stone-900">{order.customerName}</p>
            <p className="text-stone-600">{order.customerPhone}</p>
            <p className="text-stone-600">{order.customerEmail}</p>
          </div>

          <div>
            <span className="font-bold text-stone-800 uppercase tracking-wider block mb-1">
              Delivery Destination
            </span>
            <p className="text-stone-700">{order.shippingAddress.address}</p>
            <p className="text-stone-700">
              {order.shippingAddress.area ? `${order.shippingAddress.area}, ` : ''}
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode ? ` - ${order.shippingAddress.postalCode}` : ''}
            </p>
            {order.shippingAddress.instructions && (
              <p className="text-[11px] text-stone-500 mt-1 italic">
                Note: {order.shippingAddress.instructions}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Order Items
          </span>
          <div className="border border-stone-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-100 text-stone-700 border-b border-stone-200">
                  <th className="py-2.5 px-3 font-semibold">Garment / Item</th>
                  <th className="py-2.5 px-2 font-semibold text-center">Specs</th>
                  <th className="py-2.5 px-2 font-semibold text-center">Qty</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Price</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-stone-900">{item.title}</div>
                    </td>
                    <td className="py-2.5 px-2 text-center text-stone-600">
                      <span>{item.size}</span>
                      {item.color && item.color !== 'Standard' && (
                        <span className="text-stone-400"> / {item.color}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-center font-medium text-stone-900">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right text-stone-600">
                      {storeConfig.currencySymbol} {item.unitPrice.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-stone-900">
                      {storeConfig.currencySymbol} {item.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Breakdown & Payment Summary */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-2">
          <div className="text-xs text-stone-500 space-y-1 sm:max-w-xs">
            <span className="font-bold text-stone-800 block mb-1">Payment Method:</span>
            <div className="flex items-center gap-1.5 text-stone-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                {order.paymentMethod === 'cod'
                  ? 'Cash on Delivery (Pay upon arrival)'
                  : 'Online Payment Verified'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 pt-1">
              Thank you for shopping at Gondal Clothes House. For inquiries regarding exchanges or sizing, contact support with your order number.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>{storeConfig.currencySymbol} {order.subtotal.toLocaleString()}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Savings / Discount:</span>
                <span>-{storeConfig.currencySymbol} {order.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-600">
              <span>Delivery Charges:</span>
              <span>
                {order.deliveryFee === 0
                  ? 'FREE'
                  : `${storeConfig.currencySymbol} ${order.deliveryFee.toLocaleString()}`}
              </span>
            </div>

            <div className="flex justify-between text-sm font-bold text-stone-900 border-t border-stone-300 pt-2">
              <span>Grand Total:</span>
              <span>{storeConfig.currencySymbol} {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-stone-200 pt-4 text-center text-[10px] text-stone-400">
          This is a computer-generated receipt issued by Gondal Clothes House.
        </div>
      </div>
    </div>
  );
};
