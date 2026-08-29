import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyTitle?: string;
  emptySubtitle?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  emptyTitle = 'No products available yet.',
  emptySubtitle = 'Our latest clothing collections are being curated. Check back soon or contact us for inquiries.',
}) => {
  if (!products || products.length === 0) {
    return (
      <div id="products-empty-state" className="text-center py-16 px-4 bg-white rounded-3xl border border-stone-200/80 my-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-4">
          <PackageOpen className="w-8 h-8 stroke-1 text-stone-500" />
        </div>
        <h3 className="text-lg font-semibold text-stone-800">{emptyTitle}</h3>
        <p className="text-sm text-stone-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          {emptySubtitle}
        </p>
        <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gondal Clothes House • New Stock In Production</span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="product-grid"
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
