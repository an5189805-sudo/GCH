/**
 * Gondal Clothes House - Master Admin Floating Bar & Quick Control Dock
 * Gives the website owner immediate, 100% full-stack control across the entire storefront
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Shield,
  LayoutDashboard,
  PackagePlus,
  Layers,
  ShoppingBag,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Store,
  Eye,
  Sliders,
  CheckCircle2,
  Database,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { storeService } from '../../services/storeService';
import { AdminTab } from '../../types';

export const AdminFloatingBar: React.FC = () => {
  const {
    currentAdmin,
    activeView,
    setActiveView,
    setAdminTab,
    startCreatingProduct,
    adminLogout,
    showToast,
    refreshData,
  } = useStore();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showQuickModal, setShowQuickModal] = useState(false);

  // Keyboard shortcut listener: Ctrl + Shift + A or Cmd + Shift + A to toggle admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (currentAdmin) {
          if (activeView === 'admin' || activeView === 'admin-panel') {
            setActiveView('home');
          } else {
            setActiveView('admin');
          }
        } else {
          setActiveView('admin-login');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAdmin, activeView, setActiveView]);

  // Completely hide floating dock on public storefront views so no admin controls appear on front screens
  if (activeView !== 'admin' && activeView !== 'admin-panel') {
    return null;
  }

  // Real-time live stats
  const orders = storeService.getOrders();
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const messages = storeService.getMessages();
  const unreadMessages = messages.filter((m) => m.status === 'unread').length;
  const products = storeService.getProducts();
  const sections = storeService.getSections();

  const handleOpenAdminTab = (tab: AdminTab) => {
    setAdminTab(tab);
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Case 1: If Admin is Authenticated -> Show Complete Master Control Dock
  if (currentAdmin) {
    return (
      <aside
        id="admin-floating-dock"
        aria-label="Admin Control Panel Floating Bar"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300 animate-in slide-in-from-bottom-4"
      >
        <div className="bg-stone-950/95 text-white border border-amber-500/40 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl p-2 sm:p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
            {/* Left: Authority Badge & Store Stats */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-950/50">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-bold text-white font-serif tracking-wide">
                    Admin Control Panel
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold uppercase">
                    {currentAdmin.role}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-stone-400">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                  <span>•</span>
                  <span>{products.length} Products</span>
                  <span>•</span>
                  <span>{sections.length} Sections</span>
                </div>
              </div>
            </div>

            {/* Middle: Quick Action Controls */}
            {!isMinimized && (
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                {/* Main Admin Dashboard */}
                <button
                  onClick={() => handleOpenAdminTab('dashboard')}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-950/40 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Control Panel</span>
                </button>

                {/* Add Product */}
                <button
                  onClick={() => {
                    startCreatingProduct();
                    setActiveView('admin');
                  }}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                >
                  <PackagePlus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">+ Add Product</span>
                </button>

                {/* Manage Sections */}
                <button
                  onClick={() => handleOpenAdminTab('sections')}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Sections</span>
                </button>

                {/* Orders Pipeline with Live Badge */}
                <button
                  onClick={() => handleOpenAdminTab('orders')}
                  className="relative inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Orders</span>
                  {pendingOrders > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px]">
                      {pendingOrders}
                    </span>
                  )}
                </button>

                {/* Messages Inbox with Live Badge */}
                <button
                  onClick={() => handleOpenAdminTab('messages')}
                  className="relative inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Inbox</span>
                  {unreadMessages > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                {/* Store Settings & DB */}
                <button
                  onClick={() => handleOpenAdminTab('settings')}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                  title="Store Settings & Configuration"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden md:inline">Settings</span>
                </button>

                {/* Roles & Security */}
                <button
                  onClick={() => handleOpenAdminTab('roles')}
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 hover:text-white text-xs font-medium transition-colors"
                  title="Owner Controls & Security"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden lg:inline">Roles</span>
                </button>
              </div>
            )}

            {/* Right: Minimize & Logout Controls */}
            <div className="flex items-center space-x-1.5 shrink-0">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
                title={isMinimized ? 'Expand Bar' : 'Minimize Bar'}
              >
                {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <button
                onClick={adminLogout}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-900 transition-colors"
                title="Log Out of Admin Mode"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Case 2: If Not Logged In -> Do not display floating button on the front screen
  return null;
};
