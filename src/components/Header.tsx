import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  X,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Heart,
  Bell,
  ShieldCheck,
  Shield,
  Layers,
  Truck,
  HelpCircle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    storeConfig,
    publishedSections,
    cartCount,
    wishlistCount,
    unreadNotificationCount,
    setIsCartDrawerOpen,
    setIsNotificationsOpen,
    currentUser,
    currentAdmin,
    activeView,
    goToHome,
    goToAccount,
    goToContact,
    goToWishlist,
    goToDeliveryInfo,
    goToReturns,
    goToFAQ,
    openSection,
    setIsSearchModalOpen,
    setActiveView,
  } = useStore();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMenuOpen(false);
    setIsCategoriesDropdownOpen(false);
  };

  return (
    <header id="site-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all duration-200">
      {/* Top Announcement Bar */}
      <div id="top-announcement-bar" className="bg-stone-900 text-stone-200 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span className="font-medium tracking-wide">
              {storeConfig.announcementText || 'Welcome to Gondal Clothes House'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-400 text-xs">
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-stone-300" />
              {storeConfig.phone}
            </span>
            <span className="text-stone-600">|</span>
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <Mail className="w-3 h-3 text-stone-300" />
              {storeConfig.email}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile/Desktop Menu Drawer Toggle & Search */}
          <div className="flex items-center gap-2">
            <button
              id="menu-toggle-btn"
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 focus:outline-hidden flex items-center gap-1.5 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
              title="Navigation Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              <span className="hidden sm:inline text-xs font-semibold text-stone-700">Menu</span>
            </button>

            <button
              id="mobile-search-btn"
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-xl"
              aria-label="Open Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo & Name Area */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start">
            <button
              id="brand-logo-btn"
              onClick={goToHome}
              className="flex items-center gap-3 group text-left focus:outline-hidden"
            >
              <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center font-serif font-bold text-xl shadow-xs group-hover:bg-stone-800 transition-colors border border-stone-800">
                G
              </div>
              <div className="flex flex-col">
                <span className="font-serif-heading font-bold text-xl sm:text-2xl tracking-tight text-stone-900 leading-none">
                  {storeConfig.storeName}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold tracking-widest text-stone-500 uppercase mt-0.5">
                  {storeConfig.tagline || 'Exclusive Clothing & Attire'}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              id="nav-home-btn"
              onClick={goToHome}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                activeView === 'home'
                  ? 'text-stone-900 bg-stone-100 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Home
            </button>

            {/* Dynamic Published Sections */}
            {publishedSections.length > 0 ? (
              publishedSections.slice(0, 4).map((sec) => (
                <button
                  key={sec.id}
                  id={`nav-section-${sec.id}`}
                  onClick={() => openSection(sec.id)}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  {sec.name}
                </button>
              ))
            ) : (
              <>
                <button
                  id="nav-men-btn"
                  onClick={() => setActiveView('sections')}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  Men
                </button>
                <button
                  id="nav-women-btn"
                  onClick={() => setActiveView('sections')}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  Women
                </button>
                <button
                  id="nav-kids-btn"
                  onClick={() => setActiveView('sections')}
                  className="px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  Kids
                </button>
              </>
            )}

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                id="nav-categories-dropdown-btn"
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesDropdownOpen(false), 200)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {isCategoriesDropdownOpen && (
                <div
                  id="categories-dropdown-menu"
                  className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {publishedSections.length > 0 ? (
                    publishedSections.map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => handleNavClick(() => openSection(sec.id))}
                        className="w-full text-left px-4 py-2.5 text-xs sm:text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 flex items-center justify-between"
                      >
                        <span>{sec.name}</span>
                        <span className="text-[10px] text-stone-400 uppercase font-semibold">View</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-stone-500 text-center">
                      <Sparkles className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                      <p className="font-semibold text-stone-800">Dynamic Catalog</p>
                      <p className="mt-0.5 text-[11px] text-stone-400">Sections will appear here once published.</p>
                    </div>
                  )}
                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      onClick={() => handleNavClick(() => setActiveView('sections'))}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-900 hover:bg-stone-50 flex items-center justify-between"
                    >
                      <span>Browse All Sections</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              id="nav-contact-btn"
              onClick={goToContact}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                activeView === 'contact'
                  ? 'text-stone-900 bg-stone-100 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* Action Utilities (Search, Wishlist, Notifications, Account, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop Search Trigger */}
            <button
              id="desktop-search-trigger-btn"
              onClick={() => setIsSearchModalOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs transition-all border border-stone-200/80 cursor-pointer"
              title="Search clothing..."
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-xs text-stone-500 pr-1">Search catalog...</span>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-stone-400 bg-white border border-stone-200 rounded-md">
                ⌘K
              </kbd>
            </button>

            {/* Wishlist Link with Live Badge */}
            <button
              id="header-wishlist-btn"
              onClick={goToWishlist}
              className={`relative p-2.5 rounded-full hover:bg-stone-100 transition-colors text-stone-700 hover:text-stone-950 ${
                activeView === 'wishlist' ? 'bg-stone-100 text-stone-950' : ''
              }`}
              title="My Wishlist"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-stone-800' : ''}`} />
              {wishlistCount > 0 && (
                <span
                  id="wishlist-badge-count"
                  className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </button>

            {/* Notifications Bell with Unread Badge */}
            <button
              id="header-notifications-btn"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-stone-100 transition-colors text-stone-700 hover:text-stone-950"
              title="Customer Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotificationCount > 0 && (
                <span
                  id="notifications-badge-count"
                  className="absolute -top-0.5 -right-0.5 bg-amber-500 text-stone-950 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Customer Account Button */}
            <button
              id="header-account-btn"
              onClick={goToAccount}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-2 ${
                activeView === 'account' ? 'bg-stone-100 text-stone-900 font-semibold' : ''
              }`}
              title="Customer Account"
              aria-label="Customer Account"
            >
              <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-800">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5 text-stone-600" />}
              </div>
              <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Shopping Cart Button with Count Badge */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center justify-center shadow-xs"
              title="Shopping Cart"
              aria-label={`Shopping Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Navigation Drawer Menu (Available via Menu button) */}
      {isMenuOpen && (
        <div id="side-navigation-drawer" className="border-t border-stone-200 bg-white/98 backdrop-blur-xl px-4 sm:px-6 pt-4 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Column 1: Store Navigation */}
            <div className="space-y-1 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2 block mb-1">
                Store Navigation
              </span>
              <button
                onClick={() => handleNavClick(goToHome)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-stone-800 hover:bg-white hover:shadow-xs transition-all"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick(() => setActiveView('sections'))}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs flex items-center justify-between transition-all"
              >
                <span>All Categories &amp; Catalog</span>
                <Layers className="w-4 h-4 text-stone-400" />
              </button>
              <button
                onClick={() => handleNavClick(goToContact)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs transition-all"
              >
                Contact Store
              </button>
            </div>

            {/* Column 2: Customer Services */}
            <div className="space-y-1 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2 block mb-1">
                Customer Services
              </span>
              <button
                onClick={() => handleNavClick(goToAccount)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs flex items-center justify-between transition-all"
              >
                <span>{currentUser ? `Account (${currentUser.name})` : 'Customer Account / Sign In'}</span>
                <UserIcon className="w-4 h-4 text-stone-500" />
              </button>
              <button
                onClick={() => handleNavClick(goToWishlist)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs flex items-center justify-between transition-all"
              >
                <span>My Wishlist</span>
                <span className="text-xs font-bold px-2 py-0.5 bg-stone-200 rounded-full text-stone-700">{wishlistCount}</span>
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsNotificationsOpen(true);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs flex items-center justify-between transition-all"
              >
                <span>Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span className="text-xs font-bold px-2 py-0.5 bg-amber-500 text-stone-950 rounded-full">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Column 3: Customer Assistance */}
            <div className="space-y-1 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2 block mb-1">
                Customer Assistance
              </span>
              <button
                onClick={() => handleNavClick(goToDeliveryInfo)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs flex items-center justify-between transition-all"
              >
                <span>Delivery &amp; Shipping Details</span>
                <Truck className="w-4 h-4 text-stone-400" />
              </button>
              <button
                onClick={() => handleNavClick(goToReturns)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs flex items-center justify-between transition-all"
              >
                <span>7-Day Returns &amp; Exchanges</span>
                <HelpCircle className="w-4 h-4 text-stone-400" />
              </button>
              <button
                onClick={() => handleNavClick(goToFAQ)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-stone-800 hover:bg-white hover:shadow-xs flex items-center justify-between transition-all"
              >
                <span>Frequently Asked Questions</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto pt-3 border-t border-stone-200 text-xs text-stone-500 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{storeConfig.phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>{storeConfig.email}</span>
              </span>
            </div>
            <span className="text-stone-400">&copy; {new Date().getFullYear()} Gondal Clothes House</span>
          </div>
        </div>
      )}
    </header>
  );
};
