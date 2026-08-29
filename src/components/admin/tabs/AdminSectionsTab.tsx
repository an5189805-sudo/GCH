/**
 * Gondal Clothes House - Admin Sections Tab
 * Manage storefront collections, categories, sort orders & visibility
 */

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Package,
  Sparkles,
  AlertTriangle,
  Image as ImageIcon,
  Save,
  Search,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { Section } from '../../../types';

export const AdminSectionsTab: React.FC = () => {
  const { sections, products, refreshData, showToast, openSection } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [visibility, setVisibility] = useState<'public' | 'hidden'>('public');
  const [allowComments, setAllowComments] = useState<boolean>(true);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenAdd = () => {
    setEditingSection(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800');
    setBannerImage('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400');
    setVideoUrl('');
    setSortOrder(sections.length);
    setStatus('published');
    setVisibility('public');
    setAllowComments(true);
    setMetaTitle('');
    setMetaDescription('');
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (sec: Section) => {
    setEditingSection(sec);
    setName(sec.name);
    setSlug(sec.slug);
    setDescription(sec.description || '');
    setImage(sec.image || '');
    setBannerImage(sec.bannerImage || '');
    setVideoUrl(sec.videoUrl || '');
    setSortOrder(sec.sortOrder ?? 0);
    setStatus(sec.status);
    setVisibility(sec.visibility);
    setAllowComments(sec.allowComments ?? true);
    setMetaTitle(sec.metaTitle || '');
    setMetaDescription(sec.metaDescription || '');
    setFormError(null);
    setModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingSection) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleSaveSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Section name is required.');
      return;
    }

    try {
      const payload: Partial<Section> = {
        id: editingSection ? editingSection.id : undefined,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        image: image.trim() || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
        bannerImage: bannerImage.trim() || undefined,
        videoUrl: videoUrl.trim() || undefined,
        sortOrder: Number(sortOrder) || 0,
        status,
        visibility,
        allowComments,
        metaTitle: metaTitle.trim() || name.trim(),
        metaDescription: metaDescription.trim() || description.trim(),
      };

      storeService.saveSection(payload as any);
      refreshData();
      setModalOpen(false);
      showToast(editingSection ? `Section "${name}" updated.` : `New section "${name}" created.`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to save section.');
    }
  };

  const handleToggleStatus = (secId: string) => {
    const updated = storeService.toggleSectionStatus(secId);
    if (updated) {
      refreshData();
      showToast(`Section "${updated.name}" is now ${updated.status}.`);
    }
  };

  const handleToggleVisibility = (secId: string) => {
    const updated = storeService.toggleSectionVisibility(secId);
    if (updated) {
      refreshData();
      showToast(`Section "${updated.name}" visibility changed to ${updated.visibility}.`);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIdx, 0, moved);

    const orderedIds = newSections.map((s) => s.id);
    storeService.reorderSections(orderedIds);
    refreshData();
    showToast('Section order rearranged.');
  };

  const handleDelete = (secId: string) => {
    storeService.deleteSection(secId);
    setDeleteConfirmId(null);
    refreshData();
    showToast('Section removed from database.');
  };

  const filteredSections = sections.filter((s) => {
    if (!searchQuery.trim()) return true;
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-serif text-white">Section &amp; Collection Management</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Organize customer showcase categories, festive collections, wedding edits, and luxury series.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Section</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sections by name or description..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="text-xs text-stone-400">
          <span>{sections.length} total sections</span> &bull;{' '}
          <span className="text-amber-400">
            {sections.filter((s) => s.status === 'published' && s.visibility === 'public').length} published on store
          </span>
        </div>
      </div>

      {/* Sections Table / Cards */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredSections.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Layers className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-300">No sections found</h3>
            <p className="text-xs text-stone-500 mt-1">Create your first catalog category to start organizing clothes.</p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-4 py-2 rounded-xl text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Section</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/40 text-stone-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 font-medium">Order</th>
                  <th className="py-3.5 px-4 font-medium">Section Info</th>
                  <th className="py-3.5 px-4 font-medium">Catalog Count</th>
                  <th className="py-3.5 px-4 font-medium">Publish Status</th>
                  <th className="py-3.5 px-4 font-medium">Visibility</th>
                  <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filteredSections.map((section, idx) => {
                  const productCount = products.filter((p) => p.sectionId === section.id).length;

                  return (
                    <tr key={section.id} className="hover:bg-stone-850/40 transition-colors">
                      {/* Sort order move buttons */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1">
                          <span className="w-6 font-mono text-stone-400 font-bold">{idx + 1}</span>
                          <div className="flex flex-col">
                            <button
                              onClick={() => handleMove(idx, 'up')}
                              disabled={idx === 0}
                              className="text-stone-500 hover:text-white disabled:opacity-20 p-0.5"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMove(idx, 'down')}
                              disabled={idx === sections.length - 1}
                              className="text-stone-500 hover:text-white disabled:opacity-20 p-0.5"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Section details */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={section.image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100'}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-stone-800 shrink-0 border border-stone-700/50"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-stone-100">{section.name}</div>
                            <div className="text-[11px] text-stone-400 line-clamp-1">{section.description}</div>
                            <span className="text-[10px] text-stone-500 font-mono">/{section.slug}</span>
                          </div>
                        </div>
                      </td>

                      {/* Product count */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-200">
                          <Package className="w-3.5 h-3.5 text-amber-400" />
                          <span>{productCount} items</span>
                        </span>
                      </td>

                      {/* Publish status */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleStatus(section.id)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                            section.status === 'published'
                              ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/50'
                              : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-750'
                          }`}
                        >
                          {section.status === 'published' ? (
                            <>
                              <Eye className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Visibility */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleVisibility(section.id)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors ${
                            section.visibility === 'public'
                              ? 'bg-sky-950/70 text-sky-400 border border-sky-800/60 hover:bg-sky-900/50'
                              : 'bg-stone-800 text-stone-400 border border-stone-700 hover:bg-stone-750'
                          }`}
                        >
                          <span>{section.visibility === 'public' ? 'Public' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => openSection(section.id)}
                            className="p-1.5 text-stone-400 hover:text-amber-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Preview Section on Store"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(section)}
                            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                            title="Edit Section"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(section.id)}
                            className="p-1.5 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-lg transition-colors"
                            title="Delete Section"
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

      {/* Add / Edit Section Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="font-semibold text-white text-base">
                {editingSection ? `Edit Section: ${editingSection.name}` : 'Create New Collection Section'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-white text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveSection} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Section Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Luxury Velvet Edit"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Slug (URL Path)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="luxury-velvet-edit"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-300 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Collection Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Sumptuous textures and timeless artisan embroidery crafted for special celebrations..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Card Thumbnail Image URL <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Hero Banner Image URL (Optional header banner for section page)
                </label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Publish Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="published">Published (Visible in store)</option>
                    <option value="draft">Draft (Admin only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Visibility
                  </label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="public">Public (Show on Homepage &amp; Menu)</option>
                    <option value="hidden">Hidden (Direct Link Only)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-300 hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold px-5 py-2 rounded-xl text-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSection ? 'Save Changes' : 'Create Section'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-semibold text-white">Delete Section</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Are you sure you want to delete this section? Existing products linked to this section will remain in the catalog as unassigned.
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
                Delete Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
