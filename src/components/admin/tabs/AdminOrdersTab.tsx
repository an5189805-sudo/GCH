/**
 * Gondal Clothes House - Admin Orders Tab
 * Complete order lifecycle management, courier tracking & status updates
 */

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  Printer,
  ChevronRight,
  Package,
  Phone,
  Mail,
  MapPin,
  Coins,
  Send,
  Trash2,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { Order, OrderStatus } from '../../../types';
import { OrderReceiptModal } from '../../OrderReceiptModal';

interface AdminOrdersTabProps {
  initialSelectedOrderId?: string | null;
}

const COURIER_OPTIONS = ['TCS Express', 'Leopards Courier', 'M&P Courier', 'Trax Logistics', 'PostEx', 'Call Courier', 'Self Delivery / Rider'];

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  initialSelectedOrderId,
}) => {
  const { refreshData, showToast } = useStore();
  const orders = storeService.getOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(() => {
    if (initialSelectedOrderId) {
      return orders.find((o) => o.id === initialSelectedOrderId || o.orderNumber === initialSelectedOrderId) || null;
    }
    return null;
  });

  // Modal states
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  const [courierName, setCourierName] = useState(COURIER_OPTIONS[0]);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'failed' | 'refunded'>('pending');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Sync modal state when order changes
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setCourierName(order.courierName || COURIER_OPTIONS[0]);
    setTrackingNumber(order.trackingNumber || '');
    setPaymentStatus(order.paymentStatus || 'pending');
    setAdminNote('');
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const updated = storeService.updateOrderStatus(
      selectedOrder.id,
      newStatus,
      adminNote || undefined,
      courierName || undefined,
      trackingNumber.trim() || undefined
    );

    if (updated) {
      storeService.updateOrderPaymentStatus(selectedOrder.id, paymentStatus);
      const reloaded = storeService.getOrderById(selectedOrder.id);
      setSelectedOrder(reloaded || null);
      refreshData();
      showToast(`Order ${selectedOrder.orderNumber} status updated to "${newStatus}".`);
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    storeService.deleteOrder(orderId);
    setDeleteConfirmId(null);
    setSelectedOrder(null);
    refreshData();
    showToast('Order removed from database.');
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = o.orderNumber.toLowerCase().includes(q);
        const matchesName = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.customerPhone.toLowerCase().includes(q);
        const matchesEmail = o.customerEmail?.toLowerCase().includes(q);
        const matchesCity = o.shippingAddress.city.toLowerCase().includes(q);
        if (!matchesNum && !matchesName && !matchesPhone && !matchesEmail && !matchesCity) {
          return false;
        }
      }

      // Status
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false;
      }

      // Payment Method
      if (paymentFilter !== 'all' && o.paymentMethod !== paymentFilter) {
        return false;
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const formatPKR = (amount: number) => `Rs. ${amount.toLocaleString('en-PK')}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-serif text-white">Order Pipeline &amp; Fulfillment</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Total {orders.length} orders &bull;{' '}
            <span className="text-amber-400 font-medium">
              {orders.filter((o) => o.status === 'pending').length} pending dispatch
            </span>
          </p>
        </div>

        {/* Quick Status Count Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-stone-950 font-bold'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Pending ({orders.filter((o) => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Confirmed ({orders.filter((o) => o.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setStatusFilter('shipped')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'shipped'
                ? 'bg-sky-600 text-white font-bold'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Shipped ({orders.filter((o) => o.status === 'shipped').length})
          </button>
          <button
            onClick={() => setStatusFilter('delivered')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'delivered'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
          >
            Delivered ({orders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order # (GCH-XXXX), Customer name, phone, or city..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
          >
            <option value="all">All Payment Methods</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="bank_transfer">Bank Transfer / Raast</option>
            <option value="easypaisa">EasyPaisa / JazzCash</option>
            <option value="card">Credit / Debit Card</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 px-4">
            <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-300">No orders found</h3>
            <p className="text-xs text-stone-500 mt-1">
              Customer orders placed on the public boutique will appear here in real time.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/40 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Order Number</th>
                  <th className="py-3.5 px-4 font-medium">Date &amp; Time</th>
                  <th className="py-3.5 px-4 font-medium">Customer</th>
                  <th className="py-3.5 px-4 font-medium">Items &amp; Details</th>
                  <th className="py-3.5 px-4 font-medium">Total (PKR)</th>
                  <th className="py-3.5 px-4 font-medium">Payment</th>
                  <th className="py-3.5 px-4 font-medium">Order Status</th>
                  <th className="py-3.5 px-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleSelectOrder(order)}
                    className={`hover:bg-stone-850/50 transition-colors cursor-pointer ${
                      selectedOrder?.id === order.id ? 'bg-amber-950/20 border-l-2 border-amber-500' : ''
                    }`}
                  >
                    {/* Order Number */}
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                      {order.orderNumber}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                      <div>{new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      <div className="text-[10px] text-stone-500">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-200">{order.customerName}</div>
                      <div className="text-[10px] text-stone-400">{order.customerPhone}</div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[120px]">{order.shippingAddress.city}</div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="text-stone-300 font-medium">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                      <div className="text-[10px] text-stone-400 line-clamp-1">
                        {order.items.map((i) => i.productTitle).join(', ')}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-semibold text-stone-100">
                      {formatPKR(order.total)}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4">
                      <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300 font-medium block w-fit">
                        {order.paymentMethod}
                      </span>
                      <span
                        className={`text-[9px] mt-0.5 block ${
                          order.paymentStatus === 'paid' ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-semibold capitalize inline-block ${
                          order.status === 'delivered'
                            ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                            : order.status === 'shipped'
                            ? 'bg-sky-950/70 text-sky-400 border border-sky-800/60'
                            : order.status === 'processing'
                            ? 'bg-purple-950/70 text-purple-400 border border-purple-800/60'
                            : order.status === 'confirmed'
                            ? 'bg-indigo-950/70 text-indigo-400 border border-indigo-800/60'
                            : order.status === 'cancelled'
                            ? 'bg-red-950/70 text-red-400 border border-red-800/60'
                            : 'bg-amber-950/70 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectOrder(order);
                        }}
                        className="bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center space-x-1"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details & Status Manager Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-white text-lg font-mono">
                    Order {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${
                      selectedOrder.status === 'delivered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : selectedOrder.status === 'shipped'
                        ? 'bg-sky-950 text-sky-400 border border-sky-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsReceiptOpen(true)}
                  className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs inline-flex items-center space-x-1 border border-stone-700"
                  title="Print Boutique Invoice"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-stone-400 hover:text-white text-2xl leading-none px-2"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Customer & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1.5">
                <span className="font-semibold text-amber-400 flex items-center space-x-1.5 uppercase text-[10px] tracking-wider">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Customer Contact</span>
                </span>
                <div className="font-medium text-stone-200 text-sm">{selectedOrder.customerName}</div>
                <div className="text-stone-400 font-mono">{selectedOrder.customerPhone}</div>
                {selectedOrder.customerEmail && (
                  <div className="text-stone-400">{selectedOrder.customerEmail}</div>
                )}
              </div>

              <div className="p-3.5 bg-stone-950/70 border border-stone-800 rounded-xl space-y-1.5">
                <span className="font-semibold text-amber-400 flex items-center space-x-1.5 uppercase text-[10px] tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Address</span>
                </span>
                <div className="text-stone-300">{selectedOrder.shippingAddress.address}</div>
                <div className="text-stone-400 font-medium">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province || 'Punjab'}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-stone-300 block uppercase tracking-wider text-[10px]">
                Ordered Items ({selectedOrder.items.length})
              </span>
              <div className="divide-y divide-stone-800 border border-stone-800 rounded-xl overflow-hidden bg-stone-950/50">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100'}
                        alt=""
                        className="w-11 h-13 object-cover rounded-lg bg-stone-800 border border-stone-700 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-stone-100 truncate">{item.productTitle}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">
                          Size: <span className="text-amber-400 font-semibold">{item.selectedSize}</span> &bull; Color: <span className="text-stone-300">{item.selectedColor}</span>
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          Qty: {item.quantity} &times; {formatPKR(item.price)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-semibold text-stone-200">
                        {formatPKR(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Summary */}
              <div className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl space-y-1 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal:</span>
                  <span>{formatPKR(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Delivery Fee:</span>
                  <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : formatPKR(selectedOrder.deliveryFee)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>-{formatPKR(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-amber-400 pt-2 border-t border-stone-800">
                  <span>Total Amount:</span>
                  <span>{formatPKR(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Status Update & Courier Assignment Form */}
            <form onSubmit={handleUpdateStatus} className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-4">
              <h4 className="font-semibold text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Update Fulfillment &amp; Courier Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Order Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="pending">Pending (Awaiting review)</option>
                    <option value="confirmed">Confirmed (Order verified)</option>
                    <option value="processing">Processing (Packaging in Boutique)</option>
                    <option value="shipped">Shipped (Dispatched to Courier)</option>
                    <option value="delivered">Delivered (Handed over to customer)</option>
                    <option value="cancelled">Cancelled (Order voided)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid (Confirmed receipt)</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Courier Service Partner
                  </label>
                  <select
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {COURIER_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Tracking Number / Consignment #
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. TCS-78901234"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-400 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Internal Administrative Note / Customer Message
                </label>
                <input
                  type="text"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="e.g. Customer requested urgent delivery before Saturday wedding."
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedOrder.id)}
                  className="text-xs text-red-400 hover:text-red-300 inline-flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Order</span>
                </button>

                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2 rounded-xl text-xs transition-colors inline-flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Status Changes</span>
                </button>
              </div>
            </form>

            {/* Status History Timeline */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-800 text-xs">
                <span className="font-semibold text-stone-400 block uppercase text-[10px]">
                  Fulfillment History Log
                </span>
                <div className="space-y-2">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start space-x-2 text-stone-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-semibold text-stone-200 uppercase">{h.status}</span> &bull;{' '}
                        <span>{new Date(h.timestamp).toLocaleString()}</span>
                        {h.note && <p className="text-stone-400 mt-0.5">{h.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {isReceiptOpen && selectedOrder && (
        <OrderReceiptModal
          order={selectedOrder}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}

      {/* Delete Order Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-semibold text-white">Delete Order</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete this customer order?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-xl text-xs text-stone-300 hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
