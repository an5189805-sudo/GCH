import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { Product } from '../types';

export const WishlistView: React.FC = () => {
  const {
    wishlistProducts,
    wishlistCount,
    removeFromWishlist,
    clearWishlist,
    moveWishlistToCart,
    openProduct,
    goToHome,
    storeConfig,
  } = useStore();

  return (
    <div id="wishlist-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <button
            type="button"
            onClick={goToHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-950">
              My Wishlist
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-bold font-mono">
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Saved garments and personal favorites ready to purchase.
          </p>
        </div>

        {wishlistCount > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-100 hover:text-stone-900 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Clear Wishlist</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {wishlistCount === 0 || wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 sm:p-16 text-center border border-stone-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <Heart className="w-8 h-8 stroke-1" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Your wishlist is empty.</h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
            Explore our curated collections of eastern and modern apparel and click the heart icon on any garment to save it here for later.
          </p>
          <div className="pt-3">
            <button
              type="button"
              onClick={goToHome}
              className="px-6 py-3 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs inline-flex items-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Wishlist Items Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product: Product) => {
            const hasDiscount = Boolean(product.discount && product.discount > 0);
            const discountedPrice = hasDiscount && product.originalPrice
              ? Math.round(product.originalPrice * (1 - (product.discount || 0) / 100))
              : product.price;

            const isOutOfStock = product.stock <= 0;
            const isLowStock = product.stock > 0 && product.stock <= 3;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image & Badges */}
                <div className="relative aspect-3/4 bg-stone-100 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => openProduct(product.id)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                      No Image
                    </div>
                  )}

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
                    {hasDiscount && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] uppercase tracking-wider shadow-xs">
                        -{product.discount}% OFF
                      </span>
                    )}
                    {isOutOfStock ? (
                      <span className="px-2.5 py-1 rounded-full bg-stone-900 text-white font-bold text-[10px] uppercase tracking-wider">
                        Out of Stock
                      </span>
                    ) : isLowStock ? (
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] uppercase tracking-wider">
                        Only {product.stock} Left
                      </span>
                    ) : null}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-red-500 hover:bg-white hover:text-red-600 shadow-xs flex items-center justify-center transition-transform active:scale-90"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    {product.sectionName && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        {product.sectionName}
                      </span>
                    )}
                    <h3
                      className="font-bold text-stone-900 text-sm hover:underline cursor-pointer line-clamp-1"
                      onClick={() => openProduct(product.id)}
                    >
                      {product.title}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm sm:text-base text-stone-950">
                      {storeConfig.currencySymbol} {discountedPrice.toLocaleString()}
                    </span>
                    {hasDiscount && product.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {storeConfig.currencySymbol} {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Available Sizes preview */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="flex items-center gap-1 overflow-x-auto text-[10px] text-stone-500 pt-0.5">
                      <span className="text-stone-400">Sizes:</span>
                      {product.sizes.map((sz) => (
                        <span key={sz} className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-semibold">
                          {sz}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isOutOfStock}
                      onClick={() => moveWishlistToCart(product)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs ${
                        isOutOfStock
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-stone-900 text-white hover:bg-stone-800'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isOutOfStock ? 'Unavailable' : 'Move to Cart'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openProduct(product.id)}
                      className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      title="View garment details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
