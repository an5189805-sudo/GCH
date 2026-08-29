/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DynamicSections } from './components/DynamicSections';
import { ProductDetails } from './components/ProductDetails';
import { CartDrawer } from './components/CartDrawer';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrderDetailView } from './components/OrderDetailView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AccountView } from './components/AccountView';
import { WishlistView } from './components/WishlistView';
import { ContactView } from './components/ContactView';
import { SearchModal } from './components/SearchModal';
import { SearchView } from './components/SearchView';
import { SectionsBrowseView } from './components/SectionsBrowseView';
import { NotificationsModal } from './components/NotificationsModal';
import { NotFoundView } from './components/NotFoundView';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import {
  AboutView,
  DeliveryInfoView,
  PaymentInfoView,
  ReturnsView,
  PrivacyView,
  TermsView,
} from './components/InfoPages';
import { FAQView } from './components/FAQView';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { AdminFloatingBar } from './components/admin/AdminFloatingBar';
import { CheckCircle2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, currentAdmin, toastMessage } = useStore();

  // If user is accessing Admin routes, ensure authorization guard
  if (activeView === 'admin' || activeView === 'admin-panel' || activeView === 'admin-login') {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
        {toastMessage && (
          <div
            id="global-toast-notification"
            className="fixed bottom-6 right-6 z-50 bg-stone-900 text-amber-300 text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        {currentAdmin ? <AdminPanel /> : <AdminLogin />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white pb-16 md:pb-0">
      {/* Global Notification Toast */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sticky Header */}
      <Header />

      {/* Main View Switcher */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <Hero />
            <DynamicSections />
          </>
        )}

        {(activeView === 'sections' || activeView === 'section-detail') && (
          <SectionsBrowseView />
        )}

        {activeView === 'product-detail' && <ProductDetails />}

        {activeView === 'search' && <SearchView />}

        {activeView === 'cart' && <CartView />}

        {activeView === 'wishlist' && <WishlistView />}

        {activeView === 'checkout' && <CheckoutView />}

        {activeView === 'order-confirmation' && <OrderConfirmationView />}

        {activeView === 'order-detail' && <OrderDetailView />}

        {activeView === 'order-tracking' && <OrderTrackingView />}

        {activeView === 'account' && <AccountView />}

        {activeView === 'contact' && <ContactView />}

        {activeView === 'about' && <AboutView />}

        {activeView === 'delivery-info' && <DeliveryInfoView />}

        {activeView === 'payment-info' && <PaymentInfoView />}

        {activeView === 'returns' && <ReturnsView />}

        {activeView === 'privacy' && <PrivacyView />}

        {activeView === 'terms' && <TermsView />}

        {activeView === 'faq' && <FAQView />}

        {/* Fallback for any unmatched view */}
        {![
          'home',
          'sections',
          'section-detail',
          'product-detail',
          'search',
          'cart',
          'wishlist',
          'checkout',
          'order-confirmation',
          'order-detail',
          'order-tracking',
          'account',
          'contact',
          'about',
          'delivery-info',
          'payment-info',
          'returns',
          'privacy',
          'terms',
          'faq',
        ].includes(activeView) && <NotFoundView />}
      </main>

      {/* Modals & Drawers */}
      <CartDrawer />
      <SearchModal />
      <NotificationsModal />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Footer */}
      <Footer />

      {/* Master Admin Floating Dock & Quick Controls */}
      <AdminFloatingBar />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
