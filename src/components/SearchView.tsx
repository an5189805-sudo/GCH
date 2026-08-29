import React, { useState, useMemo } from 'react';
import {
  Search as SearchIcon,
  X,
  SlidersHorizontal,
  ArrowLeft,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from './ProductGrid';

export const SearchView: React.FC = () => {
  const { searchQuery, setSearchQuery, activeProducts, publishedSections, goToHome, goToAdminLogin } = useStore();

  const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('all');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc' | 'newest'>('relevance');

  // Secret admin code detection
  const normalizedQuery = (typeof searchQuery === 'string' ? searchQuery : '').toLowerCase().replace(/[\s-_]+/g, '');
  const isAdminSecret =
    normalizedQuery === 'admin8701789' ||
    normalizedQuery.includes('admin8701789');

  // Extract all sizes
  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    activeProducts.forEach((p) => p.sizes?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [activeProducts]);

  const searchResults = useMemo(() => {
    let list = [...activeProducts];
    const rawQuery = typeof searchQuery === 'string' ? searchQuery : '';
    const q = rawQuery.toLowerCase().trim();

    if (q) {
      list = list.filter((product) => {
        const titleMatch = product.title.toLowerCase().includes(q);
        const descMatch = product.description.toLowerCase().includes(q);
        const shortDescMatch = product.shortDescription?.toLowerCase().includes(q);
        const sectionMatch = product.sectionName?.toLowerCase().includes(q);
        const skuMatch = product.sku?.toLowerCase().includes(q);
        const sizeMatch = product.sizes?.some((s) => s.toLowerCase().includes(q));
        const colorMatch = product.colors?.some((c) => c.name.toLowerCase().includes(q));
        return titleMatch || descMatch || shortDescMatch || sectionMatch || skuMatch || sizeMatch || colorMatch;
      });
    }

    // Filter by Section
    if (selectedSectionFilter !== 'all') {
      list = list.filter((p) => p.sectionId === selectedSectionFilter);
    }

    // Filter by Size
    if (selectedSizeFilter !== 'all') {
      list = list.filter((p) => p.sizes?.includes(selectedSizeFilter));
    }

    // Filter by In-Stock
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sort
    list.sort((a, b) => {
      const priceA = a.discount && a.originalPrice ? Math.round(a.originalPrice * (1 - a.discount / 100)) : a.price;
      const priceB = b.discount && b.originalPrice ? Math.round(b.originalPrice * (1 - b.discount / 100)) : b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'newest') return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      return 0; // relevance
    });

    return list;
  }, [searchQuery, activeProducts, selectedSectionFilter, selectedSizeFilter, inStockOnly, sortBy]);

  const activeFiltersCount = [
    selectedSectionFilter !== 'all',
    selectedSizeFilter !== 'all',
    inStockOnly,
  ].filter(Boolean).length;

  return (
    <div id="search-results-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header with Back button & search bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={goToHome}
            className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
            title="Return to Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900">
              Product Search
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              {searchQuery ? `Showing results for "${searchQuery}"` : 'Browse all catalog garments'}
            </p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative max-w-md w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isAdminSecret) {
                setSearchQuery('');
                goToAdminLogin();
              }
            }}
            placeholder="Search by title, style, size, color, SKU..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 text-sm shadow-2xs"
          />
          <SearchIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Secret Admin Gateway Card Triggered by Search */}
      {isAdminSecret && (
        <div
          id="searchview-admin-trigger-card"
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border-2 border-amber-500/60 shadow-2xl text-stone-100 animate-in zoom-in-95 duration-200"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-950/60 shrink-0">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  Super Admin Key Detected
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                Gondal Clothes House &mdash; Admin Portal
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-lg">
                Admin security key authorized. Click the button below to proceed to the multi-step security gate (PIN &amp; Security Questions).
              </p>
              <div className="pt-3">
                <button
                  id="searchview-open-admin-btn"
                  onClick={() => {
                    setSearchQuery('');
                    goToAdminLogin();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-6 py-3.5 rounded-xl shadow-xl shadow-amber-950/40 transition-all text-sm cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-stone-950" />
                  <span>Enter Admin Panel</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort Options Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Section Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-stone-700">Category:</span>
            <select
              value={selectedSectionFilter}
              onChange={(e) => setSelectedSectionFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {publishedSections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Size Filter */}
          {availableSizes.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-700">Size:</span>
              <select
                value={selectedSizeFilter}
                onChange={(e) => setSelectedSizeFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none"
              >
                <option value="all">All Sizes</option>
                {availableSizes.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* In Stock Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer ml-1">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded text-stone-900 focus:ring-stone-900"
            />
            <span className="text-stone-700 font-medium">In Stock Only</span>
          </label>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-stone-50 text-stone-800 focus:outline-none"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-bold uppercase tracking-wider text-stone-700">
          {searchResults.length} {searchResults.length === 1 ? 'Product' : 'Products'} Found
        </span>

        {activeFiltersCount > 0 && (
          <button
            onClick={() => {
              setSelectedSectionFilter('all');
              setSelectedSizeFilter('all');
              setInStockOnly(false);
            }}
            className="text-amber-800 hover:text-stone-900 underline font-semibold"
          >
            Clear Active Filters
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      <ProductGrid
        products={searchResults}
        emptyTitle={searchQuery ? `No matches for "${searchQuery}"` : 'No products found'}
        emptySubtitle={
          searchQuery
            ? 'Try checking for spelling errors, using more general keywords, or browsing our full collection.'
            : 'Explore our catalog categories or adjust your filters.'
        }
      />
    </div>
  );
};
