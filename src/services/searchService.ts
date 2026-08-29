/**
 * Gondal Clothes House - Dynamic Search & Indexing Engine
 * High-performance client-side multi-field product & content search
 */

import { Product, Section, FAQItem } from '../types';

export interface SearchFilters {
  sectionId?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  sortBy?: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'discount';
}

export class SearchService {
  /**
   * Fast multi-token search for published products
   */
  static searchProducts(
    products: Product[],
    sections: Section[],
    query: string,
    filters?: SearchFilters
  ): Product[] {
    // 1. Strictly filter active products only
    const publishedSectionIds = new Set(
      sections
        .filter((s) => s.status === 'published' && s.visibility === 'public')
        .map((s) => s.id)
    );

    let candidates = products.filter((p) => {
      // Must be active status
      if (p.status !== 'active') return false;
      // If product belongs to a section, section must be published (if sections exist)
      if (sections.length > 0 && p.sectionId && !publishedSectionIds.has(p.sectionId)) {
        return false;
      }
      return true;
    });

    // 2. Apply query search tokens
    if (query && query.trim()) {
      const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);

      candidates = candidates.filter((p) => {
        const titleStr = p.title.toLowerCase();
        const descStr = (p.description + ' ' + (p.shortDescription || '')).toLowerCase();
        const skuStr = (p.sku || '').toLowerCase();
        const sectionStr = (p.sectionName || '').toLowerCase();
        const sizesStr = (p.sizes || []).join(' ').toLowerCase();
        const colorsStr = (p.colors || []).map((c) => c.name).join(' ').toLowerCase();
        const tagsStr = (p.tags || []).join(' ').toLowerCase();

        const combined = `${titleStr} ${descStr} ${skuStr} ${sectionStr} ${sizesStr} ${colorsStr} ${tagsStr}`;

        // Every search token must match at least one field
        return tokens.every((token) => combined.includes(token));
      });
    }

    // 3. Apply attribute filters
    if (filters) {
      if (filters.sectionId && filters.sectionId !== 'all') {
        candidates = candidates.filter((p) => p.sectionId === filters.sectionId);
      }

      if (filters.minPrice !== undefined && filters.minPrice > 0) {
        candidates = candidates.filter((p) => {
          const effectivePrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
          return effectivePrice >= filters.minPrice!;
        });
      }

      if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
        candidates = candidates.filter((p) => {
          const effectivePrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
          return effectivePrice <= filters.maxPrice!;
        });
      }

      if (filters.size) {
        const targetSize = filters.size.toLowerCase();
        candidates = candidates.filter((p) =>
          p.sizes?.some((s) => s.toLowerCase() === targetSize)
        );
      }

      if (filters.color) {
        const targetColor = filters.color.toLowerCase();
        candidates = candidates.filter((p) =>
          p.colors?.some((c) => c.name.toLowerCase().includes(targetColor))
        );
      }

      if (filters.inStockOnly) {
        candidates = candidates.filter((p) => p.stock > 0);
      }

      if (filters.onSaleOnly) {
        candidates = candidates.filter((p) => (p.discount && p.discount > 0) || (p.originalPrice && p.originalPrice > p.price));
      }

      if (filters.isNewArrival) {
        candidates = candidates.filter((p) => p.isNewArrival);
      }

      if (filters.isFeatured) {
        candidates = candidates.filter((p) => p.isFeatured);
      }

      // 4. Sort results
      if (filters.sortBy) {
        candidates.sort((a, b) => {
          const priceA = a.discount ? a.price * (1 - a.discount / 100) : a.price;
          const priceB = b.discount ? b.price * (1 - b.discount / 100) : b.price;

          switch (filters.sortBy) {
            case 'price-asc':
              return priceA - priceB;
            case 'price-desc':
              return priceB - priceA;
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'discount':
              return (b.discount || 0) - (a.discount || 0);
            case 'featured':
            default:
              if (a.isFeatured && !b.isFeatured) return -1;
              if (!a.isFeatured && b.isFeatured) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
      }
    }

    return candidates;
  }

  /**
   * Search published FAQs
   */
  static searchFAQs(faqs: FAQItem[], query: string): FAQItem[] {
    if (!query || !query.trim()) return faqs;
    const q = query.toLowerCase().trim();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
    );
  }
}
