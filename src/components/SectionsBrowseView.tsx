import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  Tag,
  Check,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from './ProductGrid';
import { Product } from '../types';

export const SectionsBrowseView: React.FC = () => {
  const {
    publishedSections,
    activeProducts,
    selectedSectionId,
    openSection,
    setActiveView,
  } = useStore();

  // Filter and Sort states
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('all');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name'>('newest');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  // Active section entity
  const currentSection = useMemo(() => {
    if (!selectedSectionId || selectedSectionId === 'all') return null;
    return publishedSections.find((s) => s.id === selectedSectionId) || null;
  }, [selectedSectionId, publishedSections]);

  // Extract all available sizes and colors across the catalog for filter options
  const { availableSizes, availableColors } = useMemo(() => {
    const sizesSet = new Set<string>();
    const colorsMap = new Map<string, string>(); // name -> hex

    activeProducts.forEach((p) => {
      p.sizes?.forEach((s) => sizesSet.add(s));
      p.colors?.forEach((c) => {
        if (!colorsMap.has(c.name)) {
          colorsMap.set(c.name, c.hex);
        }
      });
    });

    return {
      availableSizes: Array.from(sizesSet),
      availableColors: Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex })),
    };
  }, [activeProducts]);

  // Filtered & Sorted products list
  const displayedProducts = useMemo(() => {
    let list = [...activeProducts];

    // Filter by section
    if (selectedSectionId && selectedSectionId !== 'all') {
      list = list.filter((p) => p.sectionId === selectedSectionId);
    }

    // Filter by keyword
    if (filterSearch.trim()) {
      const q = filterSearch.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const skuMatch = p.sku?.toLowerCase().includes(q);
        return titleMatch || descMatch || skuMatch;
      });
    }

    // Filter by size
    if (selectedSizeFilter !== 'all') {
      list = list.filter((p) => p.sizes?.includes(selectedSizeFilter));
    }

    // Filter by color
    if (selectedColorFilter !== 'all') {
      list = list.filter((p) => p.colors?.some((c) => c.name.toLowerCase() === selectedColorFilter.toLowerCase()));
    }

    // Filter by in-stock
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0);
    }

    // Filter by on-sale
    if (onSaleOnly) {
      list = list.filter((p) => (p.discount && p.discount > 0) || (p.originalPrice && p.originalPrice > p.price));
    }

    // Sorting
    list.sort((a, b) => {
      const priceA = a.discount && a.originalPrice ? Math.round(a.originalPrice * (1 - a.discount / 100)) : a.price;
      const priceB = b.discount && b.originalPrice ? Math.round(b.originalPrice * (1 - b.discount / 100)) : b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      // default 'newest'
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    });

    return list;
  }, [
    activeProducts,
    selectedSectionId,
    filterSearch,
    selectedSizeFilter,
    selectedColorFilter,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  const activeFiltersCount = [
    selectedSizeFilter !== 'all',
    selectedColorFilter !== 'all',
    inStockOnly,
    onSaleOnly,
    Boolean(filterSearch.trim()),
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setFilterSearch('');
    setSelectedSizeFilter('all');
    setSelectedColorFilter('all');
    setInStockOnly(false);
    setOnSaleOnly(false);
  };

  return (
    <div id="sections-browse-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Category Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 text-amber-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Store Collections</span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold tracking-tight">
            {currentSection ? currentSection.name : 'All Categories & Attire'}
          </h1>

          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            {currentSection?.description ||
              'Discover our complete seasonal collections tailored with fine fabrics, meticulous craftsmanship, and contemporary design.'}
          </p>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          type="button"
          onClick={() => openSection('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            !selectedSectionId || selectedSectionId === 'all'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
          }`}
        >
          All Items ({activeProducts.length})
        </button>

        {publishedSections.map((sec) => {
          const isSelected = selectedSectionId === sec.id;
          const sectionCount = activeProducts.filter((p) => p.sectionId === sec.id).length;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => openSection(sec.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{sec.name}</span>
              <span className="ml-1.5 text-[11px] opacity-70">({sectionCount})</span>
            </button>
          );
        })}
      </div>

      {/* Control Bar (Search, Filters, Sort) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* In-Collection Search Input */}
          <div className="relative max-w-sm w-full">
            <input
              type="text"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              placeholder="Search in this collection..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {filterSearch && (
              <button
                onClick={() => setFilterSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                activeFiltersCount > 0 || isFilterPanelOpen
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-xs text-stone-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-medium focus:outline-none text-stone-900 cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expandable Advanced Filter Row */}
        {isFilterPanelOpen && (
          <div className="pt-3 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs animate-in slide-in-from-top-1 duration-150">
            {/* Size Filter */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Size</label>
              <select
                value={selectedSizeFilter}
                onChange={(e) => setSelectedSizeFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-800"
              >
                <option value="all">All Sizes</option>
                {availableSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Filter */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">Color</label>
              <select
                value={selectedColorFilter}
                onChange={(e) => setSelectedColorFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white text-stone-800"
              >
                <option value="all">All Colors</option>
                {availableColors.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* In-Stock & Sale Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-stone-900 focus:ring-stone-900"
                />
                <span className="text-stone-700 font-medium">In Stock Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onSaleOnly}
                  onChange={(e) => setOnSaleOnly(e.target.checked)}
                  className="rounded text-stone-900 focus:ring-stone-900"
                />
                <span className="text-stone-700 font-medium">Discounted / On Sale</span>
              </label>
            </div>

            {/* Reset Actions */}
            <div className="flex items-end justify-end">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-amber-800 hover:text-stone-900 font-semibold underline p-1"
                >
                  Reset All Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Result Count and Active Badges */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-semibold text-stone-700">
          Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'Garment' : 'Garments'}
        </span>

        {activeFiltersCount > 0 && (
          <span className="text-stone-400">
            Filtered by {activeFiltersCount} criteria
          </span>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={displayedProducts}
        emptyTitle={
          activeFiltersCount > 0
            ? 'No garments match the selected filters.'
            : currentSection
            ? `No products in "${currentSection.name}" yet.`
            : 'No products published in the catalog yet.'
        }
        emptySubtitle={
          activeFiltersCount > 0
            ? 'Try adjusting your size, color, or search parameters to see available garments.'
            : 'Check back soon as new seasonal collections are being curated.'
        }
      />
    </div>
  );
};
