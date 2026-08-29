/**
 * Gondal Clothes House - Admin Panel
 * Master Administration Container with sidebar, topbar, badge counters & dynamic tab switcher
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  MessageSquare,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Store,
  Menu,
  X,
  Bell,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { storeService } from '../../services/storeService';
import { AdminDashboardTab } from './tabs/AdminDashboardTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminProductFormTab } from './tabs/AdminProductFormTab';
import { AdminSectionsTab } from './tabs/AdminSectionsTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminCustomersTab } from './tabs/AdminCustomersTab';
import { AdminCommentsTab } from './tabs/AdminCommentsTab';
import { AdminMessagesTab } from './tabs/AdminMessagesTab';
import { AdminSettingsTab } from './tabs/AdminSettingsTab';
import { AdminRolesTab } from './tabs/AdminRolesTab';

export const AdminPanel: React.FC = () => {
  const {
    currentAdmin,
    adminTab,
    setAdminTab,
    adminLogout,
    goToHome,
    adminEditingProductId,
    startCreatingProduct,
    startEditingProduct,
    cancelEditingProduct,
    showToast,
  } = useStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedOrderIdForTab, setSelectedOrderIdForTab] = useState<string | null>(null);

  // Live badge counts
  const orders = storeService.getOrders();
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const comments = storeService.getComments();
  const pendingCommentsCount = comments.filter((c) => c.status === 'pending').length;

  const messages = storeService.getMessages();
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;

  const handleOpenOrder = (orderId: string) => {
    setSelectedOrderIdForTab(orderId);
    setAdminTab('orders');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products Catalog', icon: Package },
    { id: 'sections', label: 'Sections & Categories', icon: Layers },
    {
      id: 'orders',
      label: 'Orders Pipeline',
      icon: ShoppingBag,
      badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
      badgeColor: 'bg-amber-500 text-stone-950 font-bold',
    },
    { id: 'customers', label: 'Customer CRM', icon: Users },
    {
      id: 'comments',
      label: 'Reviews & Q&A',
      icon: MessageSquare,
      badge: pendingCommentsCount > 0 ? pendingCommentsCount : undefined,
      badgeColor: 'bg-indigo-500 text-white font-bold',
    },
    {
      id: 'messages',
      label: 'Inquiries Inbox',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-rose-500 text-white font-bold',
    },
    { id: 'roles', label: 'Owner & User Roles', icon: ShieldCheck },
    { id: 'settings', label: 'Store Settings & DB', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md shadow-amber-950/40">
                <Store className="w-5 h-5 text-stone-950" />
              </div>
              <div>
                <span className="font-serif font-bold text-sm tracking-wide text-white block">
                  GONDAL CLOTHES HOUSE
                </span>
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 inline" />
                  <span>Administrative Portal</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Public Store Shortcut & Admin Profile */}
          <div className="flex items-center space-x-3">
            <button
              onClick={goToHome}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors"
            >
              <span>View Public Store</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <div className="h-6 w-px bg-stone-800 hidden sm:block" />

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-300 text-xs">
                {currentAdmin?.name.charAt(0) || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-stone-200">{currentAdmin?.name || 'Administrator'}</div>
                <div className="text-[10px] text-stone-500 font-mono leading-none">{currentAdmin?.email}</div>
              </div>

              <button
                onClick={adminLogout}
                className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-900 rounded-xl transition-colors"
                title="Log Out of Admin Panel"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex gap-6">
        {/* Desktop Sidebar (Left) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-3 shadow-xl space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminTab === item.id && !adminEditingProductId;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    cancelEditingProduct();
                    setAdminTab(item.id as any);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-md shadow-amber-950/40'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="bg-stone-900/50 border border-stone-800/60 rounded-2xl p-4 text-xs text-stone-400 space-y-2">
            <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Store Engine</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Every update to products, categories, tariffs, and hero banners publishes live to shoppers instantly.
            </p>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex">
            <div className="w-72 bg-stone-900 border-r border-stone-800 h-full p-4 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="font-bold text-white text-sm font-serif">Admin Menu</span>
                  <button onClick={() => setMobileSidebarOpen(false)} className="text-stone-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = adminTab === item.id && !adminEditingProductId;

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          cancelEditingProduct();
                          setAdminTab(item.id as any);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-amber-600 text-stone-950 font-bold'
                            : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-amber-400'}`} />
                          <span>{item.label}</span>
                        </div>

                        {item.badge !== undefined && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-800 space-y-2">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    goToHome();
                  }}
                  className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium"
                >
                  View Public Store
                </button>
                <button
                  onClick={adminLogout}
                  className="w-full py-2 bg-red-950/50 text-red-300 hover:bg-red-900/50 rounded-xl text-xs font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
          </div>
        )}

        {/* Tab Content Display Area */}
        <main className="flex-1 min-w-0">
          {adminEditingProductId !== null || adminTab === 'product_form' ? (
            <AdminProductFormTab
              productId={adminEditingProductId === 'new' ? null : adminEditingProductId}
              onCancel={cancelEditingProduct}
              onSaved={() => {
                cancelEditingProduct();
                setAdminTab('products');
              }}
            />
          ) : adminTab === 'dashboard' ? (
            <AdminDashboardTab
              onNavigateTab={(tab) => setAdminTab(tab as any)}
              onOpenOrder={handleOpenOrder}
              onEditProduct={startEditingProduct}
            />
          ) : adminTab === 'products' ? (
            <AdminProductsTab
              onAddNew={startCreatingProduct}
              onEdit={startEditingProduct}
            />
          ) : adminTab === 'sections' ? (
            <AdminSectionsTab />
          ) : adminTab === 'orders' ? (
            <AdminOrdersTab initialSelectedOrderId={selectedOrderIdForTab} />
          ) : adminTab === 'customers' ? (
            <AdminCustomersTab onOpenOrder={handleOpenOrder} />
          ) : adminTab === 'comments' ? (
            <AdminCommentsTab />
          ) : adminTab === 'messages' ? (
            <AdminMessagesTab />
          ) : adminTab === 'roles' || adminTab === 'admins' || adminTab === 'backups' ? (
            <AdminRolesTab />
          ) : adminTab === 'settings' ? (
            <AdminSettingsTab />
          ) : (
            <AdminDashboardTab
              onNavigateTab={(tab) => setAdminTab(tab as any)}
              onOpenOrder={handleOpenOrder}
              onEditProduct={startEditingProduct}
            />
          )}
        </main>
      </div>
    </div>
  );
};
