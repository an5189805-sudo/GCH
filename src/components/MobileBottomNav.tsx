import React from 'react';
import { Home, Layers, Heart, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const {
    activeView,
    cartCount,
    wishlistCount,
    goToHome,
    goToAccount,
    goToWishlist,
    setActiveView,
    setIsCartDrawerOpen,
  } = useStore();

  const isSectionsActive = activeView === 'sections' || activeView === 'section-detail';
  const isHomeActive = activeView === 'home';
  const isWishlistActive = activeView === 'wishlist';
  const isAccountActive = activeView === 'account';

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-stone-200 shadow-lg px-2 py-1.5 safe-area-bottom"
    >
      <div className="grid grid-cols-5 items-center justify-around">
        {/* Home */}
        <button
          id="mobile-nav-home"
          type="button"
          onClick={goToHome}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isHomeActive ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5px] text-stone-900' : 'stroke-[1.75px]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Categories */}
        <button
          id="mobile-nav-categories"
          type="button"
          onClick={() => setActiveView('sections')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isSectionsActive ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Layers className={`w-5 h-5 ${isSectionsActive ? 'stroke-[2.5px] text-stone-900' : 'stroke-[1.75px]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Catalog</span>
        </button>

        {/* Wishlist */}
        <button
          id="mobile-nav-wishlist"
          type="button"
          onClick={goToWishlist}
          className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isWishlistActive ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isWishlistActive ? 'stroke-[2.5px] text-red-600 fill-red-100' : 'stroke-[1.75px]'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          id="mobile-nav-cart"
          type="button"
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-1 rounded-xl text-stone-500 hover:text-stone-800 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75px]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-500 text-stone-950 font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-1 ring-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Cart</span>
        </button>

        {/* Account */}
        <button
          id="mobile-nav-account"
          type="button"
          onClick={goToAccount}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            isAccountActive ? 'text-stone-950 font-semibold' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className={`w-5 h-5 ${isAccountActive ? 'stroke-[2.5px] text-stone-900' : 'stroke-[1.75px]'}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Account</span>
        </button>
      </div>
    </nav>
  );
};
