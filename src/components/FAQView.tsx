import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Home,
  Search,
  MessageSquare,
  Sparkles,
  Layers,
  Truck,
  CreditCard,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { storeService } from '../services/storeService';
import { FAQItem } from '../types';

export const FAQView: React.FC = () => {
  const { storeConfig, goToHome, goToContact } = useStore();
  const [faqs] = useState<FAQItem[]>(() => storeService.getFAQs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)));
    return ['all', ...cats];
  }, [faqs]);

  // Filter FAQs based on category and search query
  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCat = selectedCategory === 'all' || faq.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);
      return matchesCat && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div id="faq-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
        <button
          onClick={goToHome}
          className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold">Frequently Asked Questions</span>
      </nav>

      {/* Header */}
      <header className="space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
          <span>Customer Help Desk</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-stone-600 text-base sm:text-lg">
          Find answers to common queries regarding ordering, tailoring, fabrics, shipping, and returns.
        </p>

        {/* Search Bar */}
        <div className="pt-4 max-w-xl">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. delivery time, sizing, cash on delivery)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 text-sm placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600"
            />
          </div>
        </div>
      </header>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto py-6 scrollbar-none border-b border-stone-100">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === 'all' ? 'All Topics' : cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* FAQ Accordion List */}
      <div className="py-8 space-y-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all duration-200 shadow-xs hover:border-stone-300"
              >
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left font-medium text-stone-900 hover:text-amber-800 transition-colors"
                >
                  <span className="text-base font-semibold">{faq.question}</span>
                  <div
                    className={`p-1 rounded-full bg-stone-100 text-stone-600 transition-transform duration-200 shrink-0 ${
                      isExpanded ? 'rotate-180 bg-amber-100 text-amber-900' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/50">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                    {faq.category && (
                      <span className="inline-block mt-3 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                        Topic: {faq.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200/70 space-y-3">
            <HelpCircle className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-semibold text-stone-900 text-base">No matching questions found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              We couldn't find an answer for "{searchQuery}". Send us a direct inquiry and our boutique team will respond promptly.
            </p>
            <button
              onClick={() => goToContact()}
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Boutique Team</span>
            </button>
          </div>
        )}
      </div>

      {/* Still need help CTA */}
      <div className="mt-8 p-6 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif-heading text-lg font-bold text-white">Still have questions?</h4>
          <p className="text-xs text-stone-300">
            Our boutique representatives are happy to help you with sizes, orders, and styling.
          </p>
        </div>
        <button
          onClick={() => goToContact()}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors shrink-0"
        >
          Send Inquiry
        </button>
      </div>
    </div>
  );
};
