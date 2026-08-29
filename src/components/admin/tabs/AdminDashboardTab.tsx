/**
 * Gondal Clothes House - Admin Dashboard Tab
 * Real metrics, quick actions, recent orders, inventory alerts & activity overview
 */

import React from 'react';
import {
  Package,
  Layers,
  ShoppingBag,
  Users,
  Clock,
  Coins,
  MessageSquare,
  Mail,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { AdminTab } from '../../../types';

interface AdminDashboardTabProps {
  onNavigateTab: (tab: AdminTab) => void;
  onEditProduct: (productId: string) => void;
  onOpenOrder: (orderId: string) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  onNavigateTab,
  onEditProduct,
  onOpenOrder,
}) => {
  const { products, sections, goToHome, storeConfig } = useStore();
  const stats = storeService.getDatabaseStats();
  const orders = storeService.getOrders();
  const recentOrders = orders.slice(0, 5);
  const lowStockProducts = products.filter((p) => p.stock <= 3 && p.status === 'active');
  const recentLogs = storeService.getActivityLogs().slice(0, 6);

  const formatPKR = (amount: number) => {
    return `Rs. ${amount.toLocaleString('en-PK')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-900 to-stone-850 border border-stone-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Boutique Command Center</span>
            </div>
            <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
              {storeConfig.storeName || 'Gondal Clothes House'} Dashboard
            </h1>
            <p className="text-sm text-stone-400 mt-1">
              Live database state, inventory catalog, order pipeline, and customer interactions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigateTab('product-form')}
              className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-md shadow-amber-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
            <button
              onClick={() => onNavigateTab('sections')}
              className="inline-flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium px-4 py-2.5 rounded-xl text-xs border border-stone-700 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Manage Sections</span>
            </button>
            <button
              onClick={() => onNavigateTab('roles')}
              className="inline-flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-amber-300 font-medium px-3.5 py-2.5 rounded-xl text-xs border border-stone-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Owner &amp; Roles</span>
            </button>
            <button
              onClick={goToHome}
              className="inline-flex items-center space-x-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium px-3.5 py-2.5 rounded-xl text-xs border border-stone-700 transition-colors"
              title="Open Public Store in customer view"
            >
              <Eye className="w-4 h-4" />
              <span>View Storefront</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
              {formatPKR(stats.totalRevenue)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-stone-400 mt-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>From {stats.ordersCount} completed/pending orders</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
              {stats.productsCount}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              <span className="text-amber-400 font-medium">{stats.activeProductsCount}</span> active / published
            </div>
          </div>
        </div>

        {/* Total Sections */}
        <div
          onClick={() => onNavigateTab('sections')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Sections / Categories</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
              {stats.sectionsCount}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              <span className="text-sky-400 font-medium">{stats.publishedSectionsCount}</span> visible to shoppers
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Pending Orders</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-amber-400">
              {stats.pendingOrdersCount}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Out of {stats.ordersCount} total orders
            </div>
          </div>
        </div>

        {/* Registered Customers */}
        <div
          onClick={() => onNavigateTab('customers')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Customers</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
              {stats.usersCount}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Accounts in database
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div
          onClick={() => onNavigateTab('comments')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Reviews</span>
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
              {stats.commentsCount}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              <span className="text-amber-400 font-medium">{stats.pendingCommentsCount}</span> awaiting moderation
            </div>
          </div>
        </div>

        {/* Unread Inquiries */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Inbox Inquiries</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
              {stats.unreadMessagesCount}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Unread boutique inquiries
            </div>
          </div>
        </div>

        {/* Customer Questions */}
        <div
          onClick={() => onNavigateTab('comments')}
          className="bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-5 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Product Q&amp;A</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors">
              {stats.questionsCount}
            </div>
            <div className="text-xs text-stone-400 mt-1">
              Customer questions
            </div>
          </div>
        </div>
      </div>

      {/* Main Split: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders (2 cols on large) */}
        <div className="lg:col-span-2 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Customer Orders</h2>
              <p className="text-xs text-stone-400">Latest orders placed across all payment methods</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              <span>View All Orders ({stats.ordersCount})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-stone-800 rounded-xl">
              <ShoppingBag className="w-8 h-8 text-stone-600 mx-auto mb-2" />
              <p className="text-xs text-stone-400">No orders placed yet.</p>
              <p className="text-[11px] text-stone-500 mt-0.5">When customers place orders, they will appear here with real status controls.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3 font-medium">Order #</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-850">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-850/50 transition-colors">
                      <td className="py-3 font-mono font-medium text-amber-400">
                        {order.orderNumber}
                      </td>
                      <td className="py-3">
                        <div className="font-medium text-stone-200">{order.customerName}</div>
                        <div className="text-[10px] text-stone-500">{order.shippingAddress.city}</div>
                      </td>
                      <td className="py-3 text-stone-400">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="py-3 font-medium text-stone-100">
                        {formatPKR(order.total)}
                      </td>
                      <td className="py-3">
                        <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-stone-800 border border-stone-700 text-stone-300">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-medium capitalize ${
                            order.status === 'delivered'
                              ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
                              : order.status === 'shipped'
                              ? 'bg-sky-950/70 text-sky-400 border border-sky-800/60'
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
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            onOpenOrder(order.id);
                            onNavigateTab('orders');
                          }}
                          className="text-stone-400 hover:text-amber-400 p-1 rounded"
                          title="Manage Order"
                        >
                          <ArrowRight className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock & Alerts Sidebar */}
        <div className="space-y-6">
          {/* Low stock card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Low Stock Alerts</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {lowStockProducts.length} items
              </span>
            </div>

            {lowStockProducts.length === 0 ? (
              <div className="text-center py-6 text-xs text-stone-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                <span>All product inventories are well-stocked.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 bg-stone-950/70 border border-stone-800 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={p.images[0] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100'}
                        alt={p.title}
                        className="w-9 h-9 rounded-lg object-cover bg-stone-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-medium text-stone-200 truncate">{p.title}</h4>
                        <span className="text-[10px] text-stone-500 font-mono">{p.sku}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-red-400 block">{p.stock} left</span>
                      <button
                        onClick={() => {
                          onEditProduct(p.id);
                          onNavigateTab('product-form');
                        }}
                        className="text-[10px] text-amber-400 hover:underline"
                      >
                        Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit / Activity Stream */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Recent Admin Activity</h3>
              <button
                onClick={() => onNavigateTab('roles')}
                className="text-xs text-amber-400 hover:underline"
              >
                View Logs &amp; Audit
              </button>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-xs text-stone-500 text-center py-4">No logged activity yet.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="text-xs border-l-2 border-amber-500/40 pl-3 py-0.5">
                    <div className="font-medium text-stone-200">{log.action}</div>
                    <p className="text-[11px] text-stone-400 line-clamp-1">{log.details}</p>
                    <span className="text-[10px] text-stone-500">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {log.adminName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
