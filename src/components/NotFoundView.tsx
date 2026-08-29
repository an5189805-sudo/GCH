import React from 'react';
import { useStore } from '../context/StoreContext';
import { Compass, ArrowRight, Home } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const { goToHome, openSection, publishedSections } = useStore();

  return (
    <div
      id="not-found-view"
      className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6"
    >
      <div className="w-20 h-20 rounded-3xl bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-stone-400">
        <Compass className="w-10 h-10 stroke-1" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-950">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          The garment collection or page you were looking for is not available or has been moved. Explore our latest arrivals instead.
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
        <button
          type="button"
          onClick={goToHome}
          className="px-6 py-3 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Go Home</span>
        </button>

        {publishedSections.length > 0 && (
          <button
            type="button"
            onClick={() => openSection(publishedSections[0].id)}
            className="px-6 py-3 rounded-2xl border border-stone-200 text-stone-800 text-xs sm:text-sm font-semibold hover:bg-stone-100 transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Collections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
