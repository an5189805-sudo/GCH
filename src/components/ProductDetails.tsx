import React, { useState, useMemo, useRef } from 'react';
import {
  ShoppingBag,
  Zap,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Video,
  ArrowLeft,
  Check,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Share2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  Scissors,
  CheckCircle2,
  Heart,
  HelpCircle,
  Edit2,
  Trash2,
  BadgeCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';
import { ProductQuestion, Comment } from '../types';

export const ProductDetails: React.FC = () => {
  const {
    selectedProductId,
    products,
    storeConfig,
    addToCart,
    buyNow,
    goToHome,
    submitReview,
    updateReview,
    deleteReview,
    submitQuestion,
    currentUser,
    showToast,
    openSection,
    isInWishlist,
    toggleWishlist,
    hasPurchasedProduct,
  } = useStore();

  const product = useMemo(() => {
    return products.find((p) => p.id === selectedProductId);
  }, [products, selectedProductId]);

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [zoomStyle, setZoomStyle] = useState<{ backgroundPosition?: string; display?: string }>({ display: 'none' });

  // Selection state
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Active info tab
  const [infoTab, setInfoTab] = useState<'desc' | 'fabric' | 'shipping'>('desc');
  const [communityTab, setCommunityTab] = useState<'reviews' | 'questions'>('reviews');

  // Review form & edit state
  const [reviewAuthor, setReviewAuthor] = useState<string>(currentUser?.name || '');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editCommentText, setEditCommentText] = useState<string>('');
  const [editCommentRating, setEditCommentRating] = useState<number>(5);

  // Question form state
  const [questionAuthor, setQuestionAuthor] = useState<string>(currentUser?.name || '');
  const [questionText, setQuestionText] = useState<string>('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState<boolean>(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Load reviews for this product
  const comments = useMemo(() => {
    if (!product) return [];
    return storeService.getApprovedCommentsForProduct(product.id);
  }, [product, isSubmittingReview, editingReviewId]);

  // Load questions for this product
  const questions = useMemo(() => {
    if (!product) return [];
    return storeService.getQuestionsForProduct(product.id);
  }, [product, isSubmittingQuestion]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (comments.length === 0) return 0;
    const sum = comments.reduce((acc, c) => acc + c.rating, 0);
    return Number((sum / comments.length).toFixed(1));
  }, [comments]);

  const isVerifiedBuyer = useMemo(() => {
    if (!product) return false;
    return hasPurchasedProduct(product.id);
  }, [hasPurchasedProduct, product]);

  const inWishlist = product ? isInWishlist(product.id) : false;

  // Set initial selections when product loads
  React.useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize('Standard');
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0].name);
      } else {
        setSelectedColor('Default');
      }
      setQuantity(1);
      setActiveImageIndex(0);
      setIsVideoMode(false);
      setValidationError(null);
    }
  }, [product]);

  if (!product) {
    return (
      <div id="product-not-found-view" className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 stroke-1 text-stone-500" />
        </div>
        <h2 className="text-xl font-bold text-stone-800">Product Not Found</h2>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          The requested product may have been updated or moved in the catalog.
        </p>
        <button
          onClick={goToHome}
          className="mt-4 px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
        >
          Return to Store Home
        </button>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const hasDiscount = Boolean(product.discount && product.discount > 0);
  const effectivePrice = hasDiscount && product.originalPrice
    ? Math.round(product.originalPrice * (1 - product.discount! / 100))
    : product.price;

  const currentImage = product.images && product.images.length > 0 ? product.images[activeImageIndex] : '';

  // Hover zoom lens handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !currentImage) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product.images || product.images.length === 0) return;
    setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    setIsVideoMode(false);
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!product.images || product.images.length === 0) return;
    setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    setIsVideoMode(false);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError('Please choose a size before adding to cart.');
      return;
    }
    setValidationError(null);
    addToCart(product, selectedSize || 'Standard', selectedColor || 'Standard', quantity);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError('Please choose a size before proceeding.');
      return;
    }
    setValidationError(null);
    buyNow(product, selectedSize || 'Standard', selectedColor || 'Standard', quantity);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    try {
      await submitReview(product.id, reviewComment, reviewRating, reviewAuthor);
      setReviewComment('');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleStartEditReview = (comm: Comment) => {
    setEditingReviewId(comm.id);
    setEditCommentText(comm.comment);
    setEditCommentRating(comm.rating);
  };

  const handleSaveEditReview = async (commentId: string) => {
    if (!editCommentText.trim()) return;
    try {
      await updateReview(commentId, editCommentText, editCommentRating);
      setEditingReviewId(null);
    } catch (err: any) {
      showToast(err.message || 'Could not update review.');
    }
  };

  const handleDeleteReview = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      await deleteReview(commentId);
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setIsSubmittingQuestion(true);
    try {
      await submitQuestion(product.id, questionText, questionAuthor);
      setQuestionText('');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/#product-${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.title} | Gondal Clothes House`,
          text: `Check out ${product.title} at Gondal Clothes House.`,
          url: shareUrl,
        });
      } catch {
        // user dismiss
      }
    } else {
      navigator.clipboard?.writeText(shareUrl);
      showToast('Product link copied to clipboard!');
    }
  };

  return (
    <div id="product-details-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb / Top Bar */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <button
            onClick={goToHome}
            className="font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Home
          </button>
          <span>/</span>
          {product.sectionId && product.sectionName ? (
            <>
              <button
                onClick={() => openSection(product.sectionId)}
                className="font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                {product.sectionName}
              </button>
              <span>/</span>
            </>
          ) : null}
          <span className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-md">
            {product.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Wishlist Button in Top Bar */}
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className={`p-2 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              inWishlist
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-stone-200 hover:bg-stone-100 text-stone-700'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-red-500' : ''}`} />
            <span className="hidden sm:inline">{inWishlist ? 'Saved' : 'Wishlist'}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors"
            title="Share Product"
            aria-label="Share Product"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-3/4 sm:aspect-4/5 rounded-3xl bg-stone-100 border border-stone-200 overflow-hidden shadow-xs group cursor-crosshair"
          >
            {isVideoMode && product.video ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-stone-950 text-white p-6">
                {product.video.startsWith('http') && (product.video.includes('youtube') || product.video.includes('vimeo')) ? (
                  <iframe
                    src={product.video}
                    title="Product Showcase Video"
                    className="w-full h-full rounded-2xl"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <Video className="w-12 h-12 text-amber-400" />
                    <h4 className="text-base font-bold">Garment Showcase</h4>
                    <p className="text-xs text-stone-400 max-w-sm">
                      Video stream for {product.title}. High definition fabric and tailoring footage.
                    </p>
                    <button
                      onClick={() => setIsVideoMode(false)}
                      className="px-4 py-2 rounded-xl bg-white text-stone-900 text-xs font-semibold hover:bg-stone-100"
                    >
                      Return to Photos
                    </button>
                  </div>
                )}
              </div>
            ) : product.images && product.images.length > 0 ? (
              <>
                <img
                  src={currentImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />

                {/* Interactive Zoom Overlay */}
                <div
                  className="hidden md:block pointer-events-none absolute inset-0 bg-no-repeat z-20 transition-opacity duration-150"
                  style={{
                    display: zoomStyle.display,
                    backgroundImage: `url(${currentImage})`,
                    backgroundPosition: zoomStyle.backgroundPosition,
                    backgroundSize: '220%',
                  }}
                />
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-8">
                <ShoppingBag className="w-12 h-12 stroke-1 text-stone-400 mb-3" />
                <span className="text-sm font-semibold text-stone-700">Gondal Clothes House</span>
                <span className="text-xs text-stone-400 mt-0.5">High Quality Fabric & Cut</span>
              </div>
            )}

            {/* Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
              {hasDiscount && (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-stone-950 shadow-xs">
                  SAVE {product.discount}%
                </span>
              )}
              {product.sectionName && (
                <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-stone-900/80 text-white backdrop-blur-xs shadow-xs">
                  {product.sectionName}
                </span>
              )}
            </div>

            {/* Fullscreen Lightbox Trigger */}
            {product.images && product.images.length > 0 && !isVideoMode && (
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 z-20 p-2.5 rounded-xl bg-white/90 text-stone-800 hover:bg-white shadow-md backdrop-blur-xs transition-colors"
                title="Open Fullscreen Lightbox"
                aria-label="Open Fullscreen Lightbox"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Navigation Arrows for Multi-image */}
            {product.images && product.images.length > 1 && !isVideoMode && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/85 text-stone-800 hover:bg-white shadow-md backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/85 text-stone-800 hover:bg-white shadow-md backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Video Mode Toggle */}
            {product.video && (
              <button
                onClick={() => setIsVideoMode(!isVideoMode)}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/75 text-white backdrop-blur-xs hover:bg-black flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>{isVideoMode ? 'View Photos' : 'Watch Video'}</span>
              </button>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsVideoMode(false);
                  }}
                  className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx && !isVideoMode
                      ? 'border-stone-900 ring-2 ring-stone-900/20 shadow-xs'
                      : 'border-stone-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}

              {product.video && (
                <button
                  onClick={() => setIsVideoMode(true)}
                  className={`w-20 h-24 rounded-2xl bg-stone-900 text-white flex flex-col items-center justify-center shrink-0 border-2 transition-all ${
                    isVideoMode
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                      : 'border-stone-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Video className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Video</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>SKU: <strong className="text-stone-700 font-mono">{product.sku || 'GCH-CLOTH'}</strong></span>
              {isOutOfStock ? (
                <span className="text-red-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="text-amber-700 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Only {product.stock} left in stock
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                </span>
              )}
            </div>

            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating Stars summary if reviews exist */}
            {comments.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-stone-800">{averageRating}</span>
                <span className="text-xs text-stone-400">({comments.length} reviews)</span>
              </div>
            )}

            {/* Price section */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-stone-900">
                {storeConfig.currencySymbol} {effectivePrice.toLocaleString()}
              </span>
              {hasDiscount && product.originalPrice && (
                <span className="text-base text-stone-400 line-through">
                  {storeConfig.currencySymbol} {product.originalPrice.toLocaleString()}
                </span>
              )}
              {hasDiscount && (
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-lg">
                  {product.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Out of Stock Notice Banner */}
          {isOutOfStock && (
            <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 text-stone-700 text-xs flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">This product is currently unavailable.</p>
                <p className="text-stone-500 mt-0.5">
                  We are restocking soon. You can add it to your wishlist to receive updates when available.
                </p>
              </div>
            </div>
          )}

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Dynamic Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2 border-t border-stone-100 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">
                  Select Color: <span className="font-normal text-stone-600">{selectedColor}</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                {product.colors.map((color, idx) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color.name);
                        setValidationError(null);
                      }}
                      className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs inline-block"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2 border-t border-stone-100 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">
                  Select Size: <span className="font-normal text-stone-600">{selectedSize}</span>
                </span>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Scissors className="w-3 h-3 text-stone-400" /> Standard Tailoring
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {product.sizes.map((size, idx) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setValidationError(null);
                      }}
                      className={`min-w-[48px] px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        isSelected
                          ? 'bg-stone-900 text-white shadow-xs ring-2 ring-stone-900/20'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2 border-t border-stone-100 pt-4">
            <span className="text-xs font-semibold text-stone-900 block">Quantity:</span>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-xl border border-stone-300 bg-white">
                <button
                  type="button"
                  disabled={isOutOfStock || quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-bold text-sm disabled:opacity-30"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-stone-900 min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={isOutOfStock || quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  className="px-3.5 py-2 text-stone-600 hover:text-stone-900 font-bold text-sm disabled:opacity-30"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-stone-500">
                Total: <strong className="text-stone-900">{storeConfig.currencySymbol} {(effectivePrice * quantity).toLocaleString()}</strong>
              </span>
            </div>
          </div>

          {/* Action Buttons: Add to Cart, Buy Now, & Wishlist */}
          <div className="space-y-2.5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                id="product-add-to-cart-btn"
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="w-full py-3.5 px-4 rounded-xl border-2 border-stone-900 text-stone-900 hover:bg-stone-100 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                id="product-buy-now-btn"
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 text-white hover:bg-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Buy Now</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                inWishlist
                  ? 'border-red-300 bg-red-50 text-red-600'
                  : 'border-stone-200 hover:bg-stone-50 text-stone-700'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
              <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Delivery & Assurance Details */}
          <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 space-y-3 text-xs text-stone-600">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900">Doorstep Delivery: </span>
                <span>Dispatch within 24 hours. Free delivery on orders over Rs. {storeConfig.freeDeliveryThreshold.toLocaleString()}.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900">Cash on Delivery: </span>
                <span>Inspect your parcel before paying the courier directly.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RefreshCw className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900">Hassle-Free Exchange: </span>
                <span>7 days easy size & color exchange on unworn garments.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Information, Fabric Details & Shipping */}
      <div className="border-t border-stone-200 pt-8 space-y-6">
        <div className="flex items-center gap-4 border-b border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setInfoTab('desc')}
            className={`pb-3 border-b-2 transition-colors ${
              infoTab === 'desc'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Garment Details & Description
          </button>
          <button
            onClick={() => setInfoTab('fabric')}
            className={`pb-3 border-b-2 transition-colors ${
              infoTab === 'fabric'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Fabric & Care Guide
          </button>
          <button
            onClick={() => setInfoTab('shipping')}
            className={`pb-3 border-b-2 transition-colors ${
              infoTab === 'shipping'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Shipping & Return Policy
          </button>
        </div>

        <div className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl">
          {infoTab === 'desc' && (
            <div className="space-y-3">
              <p>{product.description || product.shortDescription || 'Crafted with premium fibers and intricate detailing tailored for comfort and distinction.'}</p>
              {product.sku && (
                <p className="text-xs text-stone-500">Official Product Code: <span className="font-mono text-stone-800">{product.sku}</span></p>
              )}
            </div>
          )}

          {infoTab === 'fabric' && (
            <div className="space-y-2">
              <p>• 100% fine cotton/linen blend or premium festive weave.</p>
              <p>• Machine wash cold or gentle hand wash with like colors.</p>
              <p>• Warm iron inside out; avoid direct ironing on embellishments.</p>
              <p>• Do not bleach or tumble dry at high temperatures.</p>
            </div>
          )}

          {infoTab === 'shipping' && (
            <div className="space-y-2">
              <p>• Nationwide shipping across Pakistan through premier courier partners.</p>
              <p>• Delivery timeline: 2 to 4 business days for major cities (Lahore, Karachi, Islamabad, Gujrat, Rawalpindi).</p>
              <p>• Free shipping applies automatically to all carts with subtotal above Rs. {storeConfig.freeDeliveryThreshold.toLocaleString()}.</p>
            </div>
          )}
        </div>
      </div>

      {/* Community Section: Customer Reviews & Questions */}
      <div id="product-community-section" className="border-t border-stone-200 pt-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommunityTab('reviews')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                communityTab === 'reviews'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Reviews ({comments.length})</span>
            </button>

            <button
              onClick={() => setCommunityTab('questions')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 ${
                communityTab === 'questions'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Questions & Answers ({questions.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Customer Reviews */}
        {communityTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {comments.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-stone-300 stroke-1" />
                  <h4 className="text-sm font-semibold text-stone-800">No reviews yet.</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Be the first customer to leave verified feedback for {product.title}.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {comments.map((comm) => {
                    const isOwnReview = currentUser && comm.customerId === currentUser.id;
                    const isEditingThis = editingReviewId === comm.id;

                    return (
                      <div
                        key={comm.id}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 space-y-2 shadow-2xs"
                      >
                        {isEditingThis ? (
                          <div className="space-y-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => setEditCommentRating(s)}
                                  className="p-1"
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      s <= editCommentRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              rows={3}
                              className="w-full text-xs p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveEditReview(comm.id)}
                                className="px-3 py-1.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingReviewId(null)}
                                className="px-3 py-1.5 border border-stone-300 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-stone-900 text-white text-xs font-bold flex items-center justify-center">
                                  {comm.customerName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-stone-900">{comm.customerName}</span>
                                  {comm.isVerifiedPurchase && (
                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                                      <BadgeCheck className="w-3 h-3" />
                                      <span>Verified Buyer</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center text-amber-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < comm.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 stroke-1'
                                      }`}
                                    />
                                  ))}
                                </div>

                                {isOwnReview && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditReview(comm)}
                                      className="p-1 text-stone-400 hover:text-stone-700"
                                      title="Edit your review"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteReview(comm.id)}
                                      className="p-1 text-stone-400 hover:text-red-600"
                                      title="Delete your review"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-stone-700 leading-relaxed pt-1">{comm.comment}</p>
                            <div className="text-[10px] text-stone-400 pt-1">
                              {new Date(comm.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleReviewSubmit}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Write a Product Review</span>
                  </h4>
                  {isVerifiedBuyer && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Rating (1 to 5 Stars) *
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-stone-300 hover:text-amber-400 transition-colors"
                        aria-label={`${star} star rating`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-stone-700 ml-2">
                      {reviewRating} of 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Review / Feedback *
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    placeholder="Share details regarding fabric quality, fit, color accuracy, and finish..."
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Questions & Inquiries */}
        {communityTab === 'questions' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Questions List */}
            <div className="lg:col-span-7 space-y-4">
              {questions.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white border border-stone-200 text-center space-y-2">
                  <HelpCircle className="w-8 h-8 mx-auto text-stone-300 stroke-1" />
                  <h4 className="text-sm font-semibold text-stone-800">No questions asked yet.</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Have a question about sizing, custom tailoring, or fabric care? Ask below.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 space-y-3 shadow-2xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-stone-900">Q: {q.question}</span>
                          <span className="text-[10px] text-stone-400">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">Asked by {q.customerName}</p>
                      </div>

                      {q.answer ? (
                        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs text-stone-700 space-y-1">
                          <span className="font-bold text-stone-900 block">Gondal Store Response:</span>
                          <p>{q.answer}</p>
                        </div>
                      ) : (
                        <p className="text-[11px] text-amber-700 italic">
                          Awaiting store associate response.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ask a Question Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleQuestionSubmit}
                className="p-6 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-4"
              >
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-500" />
                  <span>Ask a Question About this Garment</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={questionAuthor}
                    onChange={(e) => setQuestionAuthor(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Question *
                  </label>
                  <textarea
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    rows={3}
                    placeholder="e.g., Does this kurti fit true to size? What is the sleeve length?"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingQuestion}
                  className="w-full py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSubmittingQuestion ? 'Submitting...' : 'Submit Question'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && currentImage && (
        <div
          id="product-image-lightbox"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white z-50 transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentImage}
              alt={product.title}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />

            {product.images && product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
