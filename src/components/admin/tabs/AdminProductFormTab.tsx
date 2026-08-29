/**
 * Gondal Clothes House - Admin Product Form Tab
 * Comprehensive editor for creating and updating luxury fashion items
 */

import React, { useState, useEffect } from 'react';
import {
  Package,
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Layers,
  Palette,
  Ruler,
  Tag,
  Search,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { Product, ProductColor, ProductSize } from '../../../types';

interface AdminProductFormTabProps {
  productId: string | null;
  onCancel: () => void;
  onSaved: (savedProduct: Product) => void;
}

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Free Size', 'Unstitched'];
const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: 'Emerald Green', hex: '#0f5132' },
  { name: 'Royal Navy', hex: '#0a2540' },
  { name: 'Deep Maroon', hex: '#631023' },
  { name: 'Mustard Gold', hex: '#d4af37' },
  { name: 'Ivory Cream', hex: '#fdfbf7' },
  { name: 'Jet Black', hex: '#111827' },
  { name: 'Blush Pink', hex: '#fbcfe8' },
  { name: 'Crimson Red', hex: '#dc2626' },
  { name: 'Olive Bronze', hex: '#65a30d' },
  { name: 'Plum Purple', hex: '#581c87' },
];

export const AdminProductFormTab: React.FC<AdminProductFormTabProps> = ({
  productId,
  onCancel,
  onSaved,
}) => {
  const { sections, refreshData, showToast } = useStore();
  const existingProduct = productId ? storeService.getProductById(productId) : null;

  // Form states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [price, setPrice] = useState<number>(4500);
  const [discount, setDiscount] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [fabricDetails, setFabricDetails] = useState('');
  const [careInstructions, setCareInstructions] = useState('');
  const [status, setStatus] = useState<'active' | 'draft' | 'archived'>('active');
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [allowComments, setAllowComments] = useState<boolean>(true);

  // Sizes & Colors
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [colors, setColors] = useState<ProductColor[]>([
    { name: 'Jet Black', hex: '#111827' },
    { name: 'Ivory Cream', hex: '#fdfbf7' },
  ]);
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#d4af37');

  // Media
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // SEO & Tags
  const [tags, setTags] = useState<string[]>(['Embroidered', 'Festive', 'Luxury']);
  const [tagInput, setTagInput] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Populate if editing
  useEffect(() => {
    if (existingProduct) {
      setTitle(existingProduct.title);
      setSlug(existingProduct.slug || '');
      setSku(existingProduct.sku);
      setSectionId(existingProduct.sectionId);
      setPrice(existingProduct.price);
      setDiscount(existingProduct.discount || 0);
      setStock(existingProduct.stock);
      setShortDescription(existingProduct.shortDescription || '');
      setDescription(existingProduct.description || '');
      setFabricDetails(existingProduct.fabricDetails || '');
      setCareInstructions(existingProduct.careInstructions || '');
      setStatus(existingProduct.status);
      setIsFeatured(Boolean(existingProduct.isFeatured));
      setAllowComments(existingProduct.allowComments ?? true);
      setSizes(existingProduct.sizes || []);
      setColors(existingProduct.colors || []);
      setImages(existingProduct.images || []);
      setVideoUrl(existingProduct.videoUrl || '');
      setTags(existingProduct.tags || []);
      setMetaTitle(existingProduct.metaTitle || '');
      setMetaDescription(existingProduct.metaDescription || '');
    } else {
      // Default SKU generation for new product
      setSku(`GCH-${Math.floor(1000 + Math.random() * 9000)}`);
      if (sections.length > 0) {
        setSectionId(sections[0].id);
      }
    }
  }, [existingProduct, sections]);

  // Auto-generate slug when title changes for new product
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!existingProduct) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  // Color helpers
  const handleAddPresetColor = (preset: { name: string; hex: string }) => {
    if (!colors.some((c) => c.name.toLowerCase() === preset.name.toLowerCase())) {
      setColors([...colors, preset]);
    }
  };

  const handleAddCustomColor = () => {
    if (!customColorName.trim()) return;
    setColors([...colors, { name: customColorName.trim(), hex: customColorHex }]);
    setCustomColorName('');
  };

  const handleRemoveColor = (idx: number) => {
    setColors(colors.filter((_, i) => i !== idx));
  };

  // Size helpers
  const handleToggleSize = (s: string) => {
    if (sizes.includes(s)) {
      setSizes(sizes.filter((item) => item !== s));
    } else {
      setSizes([...sizes, s]);
    }
  };

  const handleAddCustomSize = () => {
    if (!customSizeInput.trim()) return;
    const clean = customSizeInput.trim();
    if (!sizes.includes(clean)) {
      setSizes([...sizes, clean]);
    }
    setCustomSizeInput('');
  };

  // Image helpers
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setImages([...images, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handleSetMainImage = (index: number) => {
    if (index === 0) return;
    const newImgs = [...images];
    const target = newImgs.splice(index, 1)[0];
    newImgs.unshift(target);
    setImages(newImgs);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Tag helpers
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim();
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Calculated discounted price preview
  const effectivePrice =
    discount > 0 ? Math.round(price - (price * discount) / 100) : price;

  const handleSubmit = (e: React.FormEvent, targetStatus?: 'active' | 'draft') => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a product title.');
      return;
    }
    if (!sku.trim()) {
      setErrorMessage('Please enter a unique SKU code.');
      return;
    }
    if (!sectionId) {
      setErrorMessage('Please select a boutique category / section.');
      return;
    }
    if (price <= 0) {
      setErrorMessage('Price must be greater than zero.');
      return;
    }
    if (images.length === 0) {
      setErrorMessage('Please add at least one product photograph.');
      return;
    }

    setSaving(true);
    setErrorMessage(null);

    try {
      const productPayload = {
        id: productId || undefined,
        title: title.trim(),
        slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: sku.trim().toUpperCase(),
        sectionId,
        price: Number(price),
        discount: Number(discount) || 0,
        stock: Number(stock) || 0,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        fabricDetails: fabricDetails.trim(),
        careInstructions: careInstructions.trim(),
        status: targetStatus || status,
        isFeatured,
        allowComments,
        sizes: sizes.map((s) => ({ name: s, inStock: true })),
        colors: colors.length > 0 ? colors : [{ name: 'Standard', hex: '#000000' }],
        images: images,
        videoUrl: videoUrl.trim() || undefined,
        tags,
        metaTitle: metaTitle.trim() || title.trim(),
        metaDescription: metaDescription.trim() || shortDescription.trim(),
      };

      const saved = storeService.saveProduct(productPayload as any);
      refreshData();
      showToast(
        productId
          ? `Updated "${saved.title}" successfully!`
          : `Published new product "${saved.title}"!`
      );
      onSaved(saved);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save product to database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl text-stone-300 hover:text-white transition-colors"
            title="Return to Product List"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-serif text-white">
              {productId ? `Edit Product: ${existingProduct?.title || ''}` : 'Add New Boutique Item'}
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">
              Specify pricing, luxury fabric descriptions, high-resolution imagery, and size variants.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium rounded-xl text-xs transition-colors"
          >
            Discard
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={saving}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 font-medium rounded-xl text-xs transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'active')}
            disabled={saving}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold px-5 py-2 rounded-xl text-xs transition-all shadow-md shadow-amber-950/40 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{productId ? 'Update Product' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-2xl text-red-300 text-xs flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Form Left (2 cols), Sidebar Settings Right (1 col) */}
      <form onSubmit={(e) => handleSubmit(e)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Info, Pricing, Media & Variants */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Package className="w-4 h-4 text-amber-400" />
              <span>General Product Information</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Product Title <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Royal Emerald Hand-Embroidered Velvet Kurti"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  SKU / Unique Item Code <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. GCH-EMB-8092"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-400 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  URL Slug (Friendly Identifier)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="royal-emerald-velvet-kurti"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs font-mono text-stone-300 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Short Catchphrase / Subtitle
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Exquisite micro-embroidery on premium silk velvet with handcrafted tilla borders."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Full Description &amp; Design Notes
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detailed description of the garment cut, neckline, sleeve embellishments, occasion suitability, and styling tips..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Fabric &amp; Composition
                </label>
                <input
                  type="text"
                  value={fabricDetails}
                  onChange={(e) => setFabricDetails(e.target.value)}
                  placeholder="e.g. 100% Pure Raw Silk with Organza Dupatta"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Care &amp; Wash Instructions
                </label>
                <input
                  type="text"
                  value={careInstructions}
                  onChange={(e) => setCareInstructions(e.target.value)}
                  placeholder="e.g. Dry Clean Only. Do not bleach. Steam iron inside out."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Pricing, Discount &amp; Inventory</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Regular Price (PKR) <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-500">Rs.</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-3 py-2 text-xs text-stone-100 font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Discount (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={discount}
                    onChange={(e) => setDiscount(Math.min(90, Math.max(0, Number(e.target.value))))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-stone-500">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Available Stock <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-semibold focus:outline-none focus:border-amber-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Calculated Price Display */}
            <div className="p-3.5 bg-stone-950/60 border border-stone-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-400 block">Customer Facing Display Price:</span>
                <div className="flex items-baseline space-x-2 mt-0.5">
                  <span className="text-lg font-bold font-serif text-amber-400">
                    Rs. {effectivePrice.toLocaleString('en-PK')}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-stone-500 line-through">
                      Rs. {price.toLocaleString('en-PK')}
                    </span>
                  )}
                </div>
              </div>
              {discount > 0 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-950/80 border border-red-800/60 text-red-400 font-semibold">
                  {discount}% OFF Applied
                </span>
              )}
            </div>
          </div>

          {/* Sizes & Colors Manager */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Ruler className="w-4 h-4 text-amber-400" />
              <span>Sizes &amp; Color Variants</span>
            </h2>

            {/* Sizes */}
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-2">
                Available Garment Sizes ({sizes.length} selected)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {PRESET_SIZES.map((s) => {
                  const isSelected = sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleToggleSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-600 text-stone-950 font-bold border border-amber-500 shadow-sm'
                          : 'bg-stone-950 text-stone-400 border border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>

              {/* Custom Size Input */}
              <div className="flex items-center space-x-2 max-w-xs">
                <input
                  type="text"
                  value={customSizeInput}
                  onChange={(e) => setCustomSizeInput(e.target.value)}
                  placeholder="Add custom size (e.g. 40, Custom Stitch)"
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSize}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs border border-stone-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Colors */}
            <div className="pt-4 border-t border-stone-800">
              <label className="block text-xs font-medium text-stone-300 mb-2">
                Available Colors ({colors.length} configured)
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {colors.map((c, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center space-x-2 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-stone-700 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveColor(idx)}
                      className="text-stone-500 hover:text-red-400 text-xs ml-1"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="text-[11px] text-stone-500 mr-1 self-center">Quick presets:</span>
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleAddPresetColor(preset)}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-stone-950 border border-stone-800 text-stone-400 hover:text-white flex items-center space-x-1"
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: preset.hex }} />
                    <span>{preset.name}</span>
                  </button>
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="flex items-center space-x-2 max-w-sm">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border-0 cursor-pointer p-0"
                  title="Pick Color"
                />
                <input
                  type="text"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  placeholder="Color Name (e.g. Sage Green)"
                  className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomColor}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs border border-stone-700"
                >
                  Add Color
                </button>
              </div>
            </div>
          </div>

          {/* Media & Photography */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h2 className="text-sm font-semibold text-white flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Product Imagery &amp; Video Showcase</span>
              </h2>
              <span className="text-xs text-stone-400">{images.length} photos</span>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group bg-stone-950 border border-stone-800 rounded-xl overflow-hidden aspect-[3/4]"
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-between items-center">
                      {idx === 0 ? (
                        <span className="text-[9px] bg-amber-600 text-stone-950 font-bold px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetMainImage(idx)}
                          className="text-[9px] bg-stone-800 hover:bg-stone-700 text-stone-200 px-1.5 py-0.5 rounded"
                        >
                          Make Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 bg-red-600/80 hover:bg-red-600 text-white rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[9px] text-stone-400 truncate">Photo #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Image Input */}
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Paste Image URL (Unsplash or hosted media link)..."
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            {/* Video Showcase URL */}
            <div className="pt-3 border-t border-stone-800">
              <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center space-x-1.5">
                <Video className="w-3.5 h-3.5 text-amber-400" />
                <span>Product Video Showcase URL (Optional MP4 / YouTube embed)</span>
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Section Assignment, Visibility, SEO & Tags */}
        <div className="space-y-6">
          {/* Section Selection Card */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Section &amp; Catalog Placement</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Target Section / Collection <span className="text-amber-500">*</span>
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                required
              >
                {sections.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.status === 'draft' ? '(Draft)' : ''}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-stone-500 mt-1">
                Products placed in published sections appear live on the homepage &amp; catalog.
              </p>
            </div>
          </div>

          {/* Publishing Status & Badges */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-stone-800 pb-3">
              Visibility &amp; Badges
            </h2>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Publishing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="active">Active &amp; Published</option>
                <option value="draft">Draft (Hidden from Store)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-medium text-stone-200 block">Featured Product</span>
                  <span className="text-[10px] text-stone-500">Showcase in luxury hero banners and highlights</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowComments}
                  onChange={(e) => setAllowComments(e.target.checked)}
                  className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-medium text-stone-200 block">Allow Customer Reviews</span>
                  <span className="text-[10px] text-stone-500">Permit verified shoppers to leave feedback</span>
                </div>
              </label>
            </div>
          </div>

          {/* Tags & Search Keywords */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Tag className="w-4 h-4 text-amber-400" />
              <span>Tags &amp; Search Keywords</span>
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-stone-300 text-xs"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="text-stone-500 hover:text-red-400 text-xs"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. Lawn, Velvet, Eid 2026"
                className="flex-1 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs border border-stone-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* SEO Meta Fields */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Engine Optimization</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Gondal Clothes House - ..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Meta Description
              </label>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary for Google search results..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
