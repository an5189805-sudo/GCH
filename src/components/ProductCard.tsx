import React from 'react';
import { ShoppingBag, Eye, Video, Zap, Heart, Share2, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    storeConfig,
    addToCart,
    buyNow,
    openProduct,
    isInWishlist,
    toggleWishlist,
    showToast,
  } = useStore();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasDiscount = Boolean(product.discount && product.discount > 0);
  const effectivePrice = hasDiscount && product.originalPrice
    ? Math.round(product.originalPrice * (1 - product.discount! / 100))
    : product.price;

  const defaultSize = product.sizes?.[0] || 'Standard';
  const defaultColor = product.colors?.[0]?.name || 'Standard';

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/#product-${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} | Gondal Clothes House`,
          text: `Check out ${product.title} at Gondal Clothes House.`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or fallback
      }
    } else {
      navigator.clipboard?.writeText(shareUrl);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, defaultSize, defaultColor, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    buyNow(product, defaultSize, defaultColor, 1);
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => openProduct(product.id)}
      className="group relative flex flex-col bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Image Container with 3:4 Aspect Ratio */}
      <div className="relative aspect-3/4 w-full bg-stone-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-4 bg-stone-100">
            <ShoppingBag className="w-8 h-8 stroke-1 text-stone-300 mb-2" />
            <span className="text-xs text-stone-500 font-medium">Gondal Apparel</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold bg-amber-500 text-stone-950 shadow-xs">
              -{product.discount}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold bg-stone-900 text-white shadow-xs">
              New Arrival
            </span>
          )}
          {isLowStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 shadow-xs">
              Only {product.stock} Left
            </span>
          )}
        </div>

        {/* Top Right Action Overlay (Wishlist & Share) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`w-8 h-8 rounded-full shadow-xs flex items-center justify-center transition-transform active:scale-90 ${
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/90 backdrop-blur-xs text-stone-700 hover:text-red-500 hover:bg-white'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-stone-950 hover:bg-white shadow-xs flex items-center justify-center transition-transform active:scale-90 opacity-80 hover:opacity-100"
            title="Share product"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Indicator */}
        {product.video && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
              <Video className="w-3 h-3 text-amber-400" />
              Video
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center z-20">
            <span className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Sold Out
            </span>
          </div>
        )}

        {/* Quick View Hover Action */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            type="button"
            className="w-full py-2 px-3 bg-white/95 backdrop-blur-xs text-stone-900 text-xs font-semibold rounded-xl shadow-md hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-stone-600" />
            Quick View
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {product.sectionName && (
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-stone-400 uppercase">
              {product.sectionName}
            </span>
          )}
          <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-stone-700 transition-colors mt-0.5">
            {product.title}
          </h3>
          {product.shortDescription && (
            <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{product.shortDescription}</p>
          )}
        </div>

        {/* Color & Size Indicators */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 text-xs">
          {/* Colors */}
          {product.colors && product.colors.length > 0 ? (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col, idx) => (
                <span
                  key={idx}
                  className="w-3 h-3 rounded-full border border-stone-300 shadow-2xs inline-block"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-stone-400 font-medium">
                  +{product.colors.length - 3}
                </span>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-stone-400">Regular Fit</span>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
              <span>{product.sizes.slice(0, 3).join(', ')}</span>
              {product.sizes.length > 3 && <span>...</span>}
            </div>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-1 flex flex-col gap-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-stone-900">
              {storeConfig.currencySymbol} {effectivePrice.toLocaleString()}
            </span>
            {hasDiscount && product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                {storeConfig.currencySymbol} {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="w-full py-2 px-2.5 rounded-xl border border-stone-300 text-stone-800 hover:bg-stone-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleBuyNow}
              className="w-full py-2 px-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
