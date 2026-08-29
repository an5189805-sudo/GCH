import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Compass, MessageSquare, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HeroBanner } from '../types';

export const Hero: React.FC = () => {
  const { storeConfig, goToContact, setActiveView, openSection } = useStore();

  const activeBanners = (storeConfig.banners || []).filter((b: HeroBanner) => b.isActive);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // If dynamic published banners exist
  if (activeBanners.length > 0) {
    const currentBanner = activeBanners[currentBannerIndex];

    const handleBannerClick = () => {
      if (currentBanner.buttonLink) {
        if (currentBanner.buttonLink.startsWith('sec_')) {
          openSection(currentBanner.buttonLink);
        } else if (currentBanner.buttonLink === 'contact') {
          goToContact();
        } else {
          setActiveView('sections');
        }
      } else {
        setActiveView('sections');
      }
    };

    return (
      <section id="hero-banner-section" className="relative overflow-hidden bg-stone-950 text-white min-h-[440px] sm:min-h-[520px] flex items-center justify-center border-b border-stone-800">
        {/* Background Image / Video */}
        {currentBanner.videoUrl ? (
          <div className="absolute inset-0 z-0">
            <video
              src={currentBanner.videoUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          </div>
        ) : currentBanner.imageUrl ? (
          <div className="absolute inset-0 z-0">
            <img
              src={currentBanner.imageUrl}
              alt={currentBanner.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          {currentBanner.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentBanner.badge}</span>
            </div>
          )}

          <h1 className="font-serif-heading text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            {currentBanner.title}
          </h1>

          {currentBanner.description && (
            <p className="text-base sm:text-xl text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
              {currentBanner.description}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleBannerClick}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-amber-600 text-stone-950 font-semibold text-sm hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-[0.99]"
            >
              <span>{currentBanner.buttonText || 'Shop Collection'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={goToContact}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-all backdrop-blur-sm border border-white/20"
            >
              <MessageSquare className="w-4 h-4 text-stone-300" />
              <span>Contact Us</span>
            </button>
          </div>
        </div>

        {/* Banner Navigation Controls if Multiple */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentBannerIndex((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-all backdrop-blur-xs border border-white/10"
              aria-label="Previous Banner"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-all backdrop-blur-xs border border-white/10"
              aria-label="Next Banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentBannerIndex ? 'bg-amber-400 w-8' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>
    );
  }

  // Default elegant branded hero without fake promotional claims
  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white py-16 sm:py-24 border-b border-stone-200">
      {/* Background Subtle Accent Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1c1917_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/5 text-stone-700 text-xs font-semibold tracking-wide mb-6 border border-stone-300/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Haute Couture & Modern Ready-to-Wear</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif-heading text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 max-w-4xl mx-auto leading-[1.15]">
          Welcome to <span className="text-stone-800 underline decoration-amber-500/40 underline-offset-8">{storeConfig.storeName}</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Discover our latest clothing collections. Tailored with perfection, premium fabrics, and contemporary aesthetics designed for every occasion.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            id="hero-explore-collections-btn"
            onClick={() => setActiveView('sections')}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-white font-medium text-sm hover:bg-stone-800 transition-all shadow-sm hover:shadow active:scale-[0.99]"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Explore Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-contact-boutique-btn"
            onClick={goToContact}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-stone-800 font-medium text-sm hover:bg-stone-50 transition-all border border-stone-300 shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-stone-500" />
            <span>Contact Boutique</span>
          </button>
        </div>

        {/* Guarantee Highlights Bar */}
        <div className="mt-14 pt-8 border-t border-stone-200/80 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <span className="block text-stone-900 font-semibold text-sm">Finest Fabrics</span>
            <span className="text-xs text-stone-500">Curated materials</span>
          </div>
          <div className="p-3">
            <span className="block text-stone-900 font-semibold text-sm">Nationwide COD</span>
            <span className="text-xs text-stone-500">Pay at doorstep</span>
          </div>
          <div className="p-3">
            <span className="block text-stone-900 font-semibold text-sm">Bespoke Fit</span>
            <span className="text-xs text-stone-500">All standard sizes</span>
          </div>
          <div className="p-3">
            <span className="block text-stone-900 font-semibold text-sm">Direct Support</span>
            <span className="text-xs text-stone-500">Fast assistance</span>
          </div>
        </div>
      </div>
    </section>
  );
};

