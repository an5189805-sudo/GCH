/**
 * Gondal Clothes House - Admin Products Tab
 * Comprehensive catalog manager with search, filter, stock/price updates, duplicate & delete
 */

import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Layers,
  ArrowUpDown,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { Product } from '../../../types';

interface AdminProductsTabProps {
  onAddNewProduct: () => void;
  onEditProduct: (productId: string) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  onAddNewProduct,
  onEditProduct,
}) => {
  const { products, sections, refreshData, showToast, openProduct } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'stock'>('newest');

  // Quick edit modal or state
  const [quickStockId, setQuickStockId] = useState<string | null>(null);
  const [quickStockValue, setQuickStockValue] = useState<number>(0);
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<number>(0);
  const [quickDiscountValue, setQuickDiscountValue] = useState<number>(0);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSku && !matchesDesc) return false;
      }

      // Section
      if (selectedSection !== 'all' && p.sectionId !== selectedSection) {
        return false;
      }

      // Status
      if (selectedStatus !== 'all' && p.status !== selectedStatus) {
        return false;
      }

      // Stock
      if (stockFilter === 'in-stock' && p.stock <= 0) return false;
      if (stockFilter === 'out-of-stock' && p.stock > 0) return false;
      if (stockFilter === 'low-stock' && (p.stock <= 0 || p.stock > 3)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return 0;
    });
  }, [products, searchQuery, selectedSection, selectedStatus, stockFilter, sortBy]);

  const handleToggleStatus = (productId: string) => {
    const updated = storeService.toggleProductStatus(productId);
    if (updated) {
      refreshData();
      showToast(`Product status changed to "${updated.status}".`);
    }
  };

  const handleDuplicate = (productId: string) => {
    const dup = storeService.duplicateProduct(productId);
    if (dup) {
      refreshData();
      showToast(`Product duplicated as draft: "${dup.title}".`);
    }
  };

  const handleDelete = (productId: string) => {
    storeService.deleteProduct(productId);
    setDeleteConfirmId(null);
    refreshData();
    showToast('Product removed from database.');
  };

  const handleSaveQuickStock = (productId: string) => {
    storeService.updateProductStock(productId, quickStockValue);
    setQuickStockId(null);
    refreshData();
    showToast('Stock quantity updated.');
  };

  const handleSaveQuickPrice = (productId: string) => {
    storeService.updateProductPrice(productId, quickPriceValue, quickDiscountValue);
    setQuickPriceId(null);
    refreshData();
    showToast('Price and discount updated.');
  };

  const formatPKR = (val: number) => `Rs. ${val.toLocaleString('en-PK')}`;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-serif text-white">Product Catalog &amp; Inventory</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Total {products.length} products &bull; {products.filter((p) => p.status === 'active').length} active &bull; {products.filter((p) => p.stock <= 3).length} low stock
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, keywords..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="all">All Sections ({sections.length})</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active / Published</option>
              <option value="draft">Draft / Hidden</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock (&gt; 0)</option>
              <option value="low-stock">Low Stock (&le; 3)</option>
              <option value="out-of-stock">Out of Stock (0)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs text-stone-400">
          <div className="flex items-center space-x-2">
            <span>Showing {filteredProducts.length} of {products.length} products</span>
            {(searchQuery || selectedSection !== 'all' || selectedStatus !== 'all' || stockFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSection('all');
                  setSelectedStatus('all');
                  setStockFilter('all');
                }}
                className="text-amber-400 hover:underline ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-stone-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
            >
              <option value="newest">Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock">Stock Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Package className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-300">No products match your criteria</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms or filter selections, or click below to add a new clothing item.
            </p>
            <button
              onClick={onAddNewProduct}
              className="mt-4 inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2 rounded-xl text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Product</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/40 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Product Details</th>
                  <th className="py-3.5 px-4 font-medium">Section</th>
                  <th className="py-3.5 px-4 font-medium">Pricing</th>
                  <th className="py-3.5 px-4 font-medium">Stock</th>
                  <th className="py-3.5 px-4 font-medium">Status</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredProducts.map((product) => {
                  const section = sections.find((s) => s.id === product.sectionId);
                  const effectivePrice =
                    product.discount > 0
                      ? product.price - (product.price * product.discount) / 100
                      : product.price;

                  return (
                    <tr key={product.id} className="hover:bg-stone-850/40 transition-colors">
                      {/* Product details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={product.images[0] || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100'}
                            alt={product.title}
                            className="w-12 h-14 rounded-lg object-cover bg-stone-800 shrink-0 border border-stone-700/50"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-100 line-clamp-1">{product.title}</div>
                            <div className="flex items-center space-x-2 text-[10px] text-stone-400 mt-0.5 font-mono">
                              <span className="text-amber-400/90">{product.sku}</span>
                              <span>&bull;</span>
                              <span>{product.sizes.length} sizes</span>
                              <span>&bull;</span>
                              <span>{product.colors.length} colors</span>
                            </div>
                            {product.isFeatured && (
                              <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-300">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Section */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 text-[11px] inline-flex items-center space-x-1">
                          <Layers className="w-3 h-3 text-stone-500" />
                          <span>{section?.name || 'Uncategorized'}</span>
                        </span>
                      </td>

                      {/* Pricing with quick edit */}
                      <td className="py-3.5 px-4">
                        {quickPriceId === product.id ? (
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="number"
                              value={quickPriceValue}
                              onChange={(e) => setQuickPriceValue(Number(e.target.value))}
                              className="w-20 bg-stone-950 border border-amber-500 rounded px-2 py-1 text-xs text-white"
                              placeholder="Price"
                            />
                            <input
                              type="number"
                              value={quickDiscountValue}
                              onChange={(e) => setQuickDiscountValue(Number(e.target.value))}
                              className="w-14 bg-stone-950 border border-amber-500 rounded px-2 py-1 text-xs text-white"
                              placeholder="Disc %"
                            />
                            <button
                              onClick={() => handleSaveQuickPrice(product.id)}
                              className="bg-amber-600 text-stone-950 px-2 py-1 rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setQuickPriceId(null)}
                              className="text-stone-400 hover:text-white text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setQuickPriceId(product.id);
                              setQuickPriceValue(product.price);
                              setQuickDiscountValue(product.discount);
                            }}
                            className="cursor-pointer group/price inline-block"
                            title="Click to quick-edit price"
                          >
                            <div className="font-semibold text-stone-100 group-hover/price:text-amber-400 transition-colors">
                              {formatPKR(effectivePrice)}
                            </div>
                            {product.discount > 0 && (
                              <div className="text-[10px] text-stone-500 line-through">
                                {formatPKR(product.price)} ({product.discount}% off)
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Stock with quick edit */}
                      <td className="py-3.5 px-4">
                        {quickStockId === product.id ? (
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="number"
                              value={quickStockValue}
                              onChange={(e) => setQuickStockValue(Math.max(0, Number(e.target.value)))}
                              className="w-16 bg-stone-950 border border-amber-500 rounded px-2 py-1 text-xs text-white"
                            />
                            <button
                              onClick={() => handleSaveQuickStock(product.id)}
                              className="bg-amber-600 text-stone-950 px-2 py-1 rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setQuickStockId(null)}
                              className="text-stone-400 hover:text-white text-xs px-1"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setQuickStockId(product.id);
                              setQuickStockValue(product.stock);
                            }}
                            className="cursor-pointer group/stock inline-flex items-center space-x-1.5"
                            title="Click to quick-edit stock"
                          >
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                product.stock === 0
                                  ? 'bg-red-950/80 text-red-400 border border-red-800/60'
                                  : product.stock <= 3
                                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                                  : 'bg-stone-800 text-stone-200 border border-stone-700'
                              }`}
                            >
                              {product.stock} in stock
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Status toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(product.id)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                            product.status === 'active'
                              ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/50'
                              : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-750'
                          }`}
                        >
                          {product.status === 'active' ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => openProduct(product.id)}
                            className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Preview on Public Website"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEditProduct(product.id)}
                            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                            title="Full Product Editor"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-1.5 text-stone-400 hover:text-sky-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Duplicate as Draft"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-semibold text-white">Delete Product</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to permanently remove this product from the database? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 rounded-xl text-xs text-stone-300 hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
