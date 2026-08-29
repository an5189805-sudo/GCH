import React, { useState, useEffect, useMemo } from 'react';
import {
  Search as SearchIcon,
  X,
  Loader2,
  ArrowRight,
  PackageOpen,
  ShieldCheck,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    activeProducts,
    publishedSections,
    openSection,
    setActiveView,
    goToAdminLogin,
  } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState<string>(typeof searchQuery === 'string' ? searchQuery : '');

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(typeof searchQuery === 'string' ? searchQuery : '');
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check if secret search trigger for admin was entered (e.g., admin8701789)
  const normalizedRaw = (typeof searchQuery === 'string' ? searchQuery : '').toLowerCase().replace(/[\s-_]+/g, '');
  const normalizedDebounced = (typeof debouncedQuery === 'string' ? debouncedQuery : '').toLowerCase().replace(/[\s-_]+/g, '');
  const isAdminSecret =
    normalizedRaw === 'admin8701789' ||
    normalizedRaw.includes('admin8701789') ||
    normalizedDebounced === 'admin8701789' ||
    normalizedDebounced.includes('admin8701789');

  const handleOpenAdminGate = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
    goToAdminLogin();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isAdminSecret) {
      e.preventDefault();
      handleOpenAdminGate();
    }
  };

  const searchResults = useMemo(() => {
    const rawQuery = typeof debouncedQuery === 'string' ? debouncedQuery : '';
    if (!rawQuery.trim() || isAdminSecret) return [];
    const q = rawQuery.toLowerCase().trim();
    return activeProducts.filter((product) => {
      const titleMatch = product.title.toLowerCase().includes(q);
      const descMatch = product.description.toLowerCase().includes(q);
      const shortDescMatch = product.shortDescription?.toLowerCase().includes(q);
      const sectionMatch = product.sectionName?.toLowerCase().includes(q);
      const skuMatch = product.sku?.toLowerCase().includes(q);
      const sizeMatch = product.sizes?.some((s) => s.toLowerCase().includes(q));
      const colorMatch = product.colors?.some((c) => c.name.toLowerCase().includes(q));
      return titleMatch || descMatch || shortDescMatch || sectionMatch || skuMatch || sizeMatch || colorMatch;
    });
  }, [debouncedQuery, activeProducts, isAdminSecret]);

  if (!isSearchModalOpen) return null;

  const handleClose = () => {
    setIsSearchModalOpen(false);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleViewFullResults = () => {
    setIsSearchModalOpen(false);
    setActiveView('search');
  };

  return (
    <div id="search-modal-backdrop" className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-start justify-center pt-12 sm:pt-20 px-4">
      <div
        id="search-modal-container"
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-6 border-b border-stone-200 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-stone-100 text-stone-600 shrink-0">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-stone-900" />
            ) : (
              <SearchIcon className="w-5 h-5" />
            )}
          </div>

          <div className="flex-1 relative">
            <input
              id="search-input-field"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search by product name, category, sizes, colors, description..."
              autoFocus
              className="w-full text-base sm:text-lg font-medium text-stone-900 placeholder:text-stone-400 bg-transparent border-0 focus:ring-0 focus:outline-none pr-8"
            />
            {searchQuery && (
              <button
                id="search-clear-btn"
                onClick={handleClear}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            id="search-close-btn"
            onClick={handleClose}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-colors text-xs font-semibold cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick Category Hints */}
        {publishedSections.length > 0 && !searchQuery && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2 overflow-x-auto text-xs text-stone-600">
            <span className="font-semibold text-stone-800 shrink-0">Popular Categories:</span>
            {publishedSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  handleClose();
                  openSection(sec.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-stone-400 text-stone-700 whitespace-nowrap transition-colors cursor-pointer"
              >
                {sec.name}
              </button>
            ))}
          </div>
        )}

        {/* Search Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* 1. SECRET ADMIN ACCESS CARD (When user types admin8701789) */}
          {isAdminSecret ? (
            <div
              id="secret-admin-trigger-card"
              className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border-2 border-amber-500/50 shadow-2xl text-stone-100 animate-in zoom-in-95 duration-200"
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
                    Admin access key authorized. Click the button below to proceed to the multi-step security gate (PIN &amp; Security Questions).
                  </p>
                  <div className="pt-3">
                    <button
                      id="open-secret-admin-gate-btn"
                      onClick={handleOpenAdminGate}
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
          ) : (!debouncedQuery || typeof debouncedQuery !== 'string' || debouncedQuery.trim() === '') ? (
            <div className="py-12 text-center text-stone-400">
              <SearchIcon className="w-10 h-10 mx-auto mb-3 text-stone-300 stroke-1" />
              <p className="text-sm font-medium text-stone-600">Type a keyword to search Gondal Clothes House</p>
              <p className="text-xs text-stone-400 mt-1">Search through titles, fabrics, colors, sizes, and collections</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Found {searchResults.length} {searchResults.length === 1 ? 'Product' : 'Products'}
                </span>
                <button
                  onClick={handleViewFullResults}
                  className="text-xs font-semibold text-stone-900 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {searchResults.slice(0, 6).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ) : (
            <div id="search-no-results" className="py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
                <PackageOpen className="w-6 h-6 stroke-1 text-stone-500" />
              </div>
              <h4 className="text-base font-semibold text-stone-800">No products found.</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                We couldn&apos;t find any products matching &quot;<span className="font-semibold text-stone-700">{String(debouncedQuery || '')}</span>&quot;. Try checking for spelling errors or searching for a broader term.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
