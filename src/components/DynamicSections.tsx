import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Mail,
  ShoppingBag,
  Flame,
  Clock,
  Tag,
  Star,
  Eye,
  Percent,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductGrid } from './ProductGrid';
import { ProductCard } from './ProductCard';
import { Product } from '../types';

export const DynamicSections: React.FC = () => {
  const {
    publishedSections,
    activeProducts,
    recentlyViewedProducts,
    openSection,
    goToContact,
    setActiveView,
    storeConfig,
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>('all');

  // Dynamic filter tabs based on actual available products
  const newArrivals = useMemo(() => {
    return activeProducts.filter((p) => p.isNewArrival);
  }, [activeProducts]);

  const featuredProducts = useMemo(() => {
    return activeProducts.filter((p) => p.isFeatured);
  }, [activeProducts]);

  const saleProducts = useMemo(() => {
    return activeProducts.filter((p) => (p.discount && p.discount > 0) || (p.originalPrice && p.originalPrice > p.price));
  }, [activeProducts]);

  const menProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      const secName = p.sectionName?.toLowerCase() || '';
      const title = p.title.toLowerCase();
      return secName.includes('men') || title.includes('men') || title.includes('gents') || title.includes('kurta');
    });
  }, [activeProducts]);

  const womenProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      const secName = p.sectionName?.toLowerCase() || '';
      const title = p.title.toLowerCase();
      return secName.includes('women') || secName.includes('ladies') || title.includes('women') || title.includes('suit') || title.includes('lawn') || title.includes('chiffon');
    });
  }, [activeProducts]);

  const kidsProducts = useMemo(() => {
    return activeProducts.filter((p) => {
      const secName = p.sectionName?.toLowerCase() || '';
      const title = p.title.toLowerCase();
      return secName.includes('kid') || secName.includes('child') || title.includes('kid') || title.includes('junior') || title.includes('baby');
    });
  }, [activeProducts]);

  // Determine which tabs to offer based on actual content
  const tabs = useMemo(() => {
    const availableTabs: { id: string; label: string; icon: any; count: number; items: Product[] }[] = [
      { id: 'all', label: 'All Items', icon: ShoppingBag, count: activeProducts.length, items: activeProducts },
    ];

    if (newArrivals.length > 0) {
      availableTabs.push({ id: 'new', label: 'New Arrivals', icon: Sparkles, count: newArrivals.length, items: newArrivals });
    }
    if (featuredProducts.length > 0) {
      availableTabs.push({ id: 'featured', label: 'Featured', icon: Star, count: featuredProducts.length, items: featuredProducts });
    }
    if (saleProducts.length > 0) {
      availableTabs.push({ id: 'sale', label: 'Sale & Offers', icon: Percent, count: saleProducts.length, items: saleProducts });
    }
    if (menProducts.length > 0) {
      availableTabs.push({ id: 'men', label: "Men's Collection", icon: Layers, count: menProducts.length, items: menProducts });
    }
    if (womenProducts.length > 0) {
      availableTabs.push({ id: 'women', label: "Women's Collection", icon: Flame, count: womenProducts.length, items: womenProducts });
    }
    if (kidsProducts.length > 0) {
      availableTabs.push({ id: 'kids', label: "Kids", icon: Tag, count: kidsProducts.length, items: kidsProducts });
    }

    return availableTabs;
  }, [activeProducts, newArrivals, featuredProducts, saleProducts, menProducts, womenProducts, kidsProducts]);

  const currentTabItems = useMemo(() => {
    const found = tabs.find((t) => t.id === activeTab);
    return found ? found.items : activeProducts;
  }, [tabs, activeTab, activeProducts]);

  // If products or published sections exist in the store
  if (activeProducts.length > 0 || publishedSections.length > 0) {
    return (
      <div id="dynamic-sections-container" className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Curated Collection Filter Tabs */}
        {tabs.length > 1 && (
          <section id="curated-tabs-section" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Curated Showcase
                  </span>
                </div>
                <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  Discover Our Range
                </h2>
              </div>

              {/* Tab Navigation Pill Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-stone-900 text-white shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200/70 text-stone-600'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-stone-400'}`} />
                      <span>{tab.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-stone-800 text-amber-300' : 'bg-stone-200 text-stone-500'}`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tabbed Products Grid */}
            <ProductGrid
              products={currentTabItems}
              emptyTitle="No items in this collection currently."
              emptySubtitle="Browse our full catalog or check back shortly as new pieces arrive."
            />
          </section>
        )}

        {/* Dynamic Published Sections */}
        {publishedSections.map((section) => {
          const sectionProducts = activeProducts.filter((p) => p.sectionId === section.id);
          return (
            <section key={section.id} id={`section-${section.id}`} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Collection
                    </span>
                  </div>
                  <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                    {section.name}
                  </h2>
                  {section.description && (
                    <p className="text-sm text-stone-600 mt-1">{section.description}</p>
                  )}
                </div>

                <button
                  onClick={() => openSection(section.id)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
                >
                  <span>View All ({sectionProducts.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Product Grid */}
              <ProductGrid
                products={sectionProducts}
                emptyTitle={`No products available in ${section.name} yet.`}
                emptySubtitle="Items are currently being stocked for this collection. Please check back shortly."
              />
            </section>
          );
        })}

        {/* Promotional Delivery Banner Foundation */}
        <section id="promo-delivery-strip" className="rounded-2xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs border border-stone-800">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complimentary Shipping</span>
            </div>
            <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white">
              Free Nationwide Delivery on Orders Above {storeConfig.currencySymbol} {storeConfig.freeDeliveryThreshold.toLocaleString()}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl">
              Enjoy verified doorstep delivery with convenient Cash on Delivery across Pakistan. Inspected and securely packaged.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('sections')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors shadow-sm"
            >
              Browse Collections
            </button>
            <button
              onClick={goToContact}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/10"
            >
              Ask a Stylist
            </button>
          </div>
        </section>

        {/* Recently Viewed Products (Generated purely from actual user views) */}
        {recentlyViewedProducts.length > 0 && (
          <section id="recently-viewed-section" className="space-y-6 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-stone-100 text-stone-700">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-stone-900">
                    Recently Viewed
                  </h3>
                  <p className="text-xs text-stone-500">Pick up where you left off</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewedProducts.slice(0, 4).map((prod) => (
                <ProductCard key={`recent-${prod.id}`} product={prod} />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  // Pure clean empty state when no sections/products exist yet (as requested)
  return (
    <section id="homepage-empty-state-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-3xl border border-stone-200/80 p-8 sm:p-14 shadow-xs text-center relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -z-0 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-stone-100 rounded-full blur-3xl -z-0 opacity-60"></div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-white mx-auto flex items-center justify-center shadow-sm">
            <Layers className="w-8 h-8 stroke-1 text-amber-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Welcome to our store</span>
            </div>
            <h2 className="font-serif-heading text-2xl sm:text-4xl font-bold text-stone-900">
              Our collections will appear here soon.
            </h2>
            <p className="text-stone-600 text-base leading-relaxed pt-1">
              Gondal Clothes House is preparing the latest seasonal apparel, premium unstitched fabrics, and bespoke formal wear. Check back soon or contact us directly to place a custom inquiry.
            </p>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
              <ShoppingBag className="w-5 h-5 text-stone-700 mb-2" />
              <h4 className="text-sm font-semibold text-stone-900">Curated Lines</h4>
              <p className="text-xs text-stone-500 mt-1">Men, Women, Kids & Special Festive editions.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
              <ShieldCheck className="w-5 h-5 text-stone-700 mb-2" />
              <h4 className="text-sm font-semibold text-stone-900">Authentic Stitching</h4>
              <p className="text-xs text-stone-500 mt-1">High grade threads, durable styling, perfect cuts.</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60">
              <Mail className="w-5 h-5 text-stone-700 mb-2" />
              <h4 className="text-sm font-semibold text-stone-900">Direct Inquiries</h4>
              <p className="text-xs text-stone-500 mt-1">Send a message to our shop representatives.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={goToContact}
              className="px-6 py-3 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors shadow-xs"
            >
              Contact Store Directly
            </button>
            <button
              onClick={() => setActiveView('account')}
              className="px-6 py-3 rounded-xl bg-white border border-stone-300 text-stone-800 text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              Customer Account
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

