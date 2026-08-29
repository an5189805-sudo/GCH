/**
 * Gondal Clothes House - Admin Settings & Store Management Tab
 * Boutique identity, delivery rates, banner carousels, policy management, security & DB snapshots
 */

import React, { useState } from 'react';
import {
  Settings,
  Store,
  Truck,
  Image as ImageIcon,
  HelpCircle,
  Shield,
  Database,
  Lock,
  Plus,
  Trash2,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Activity,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { StoreBanner, FAQItem } from '../../../types';

export const AdminSettingsTab: React.FC = () => {
  const { currentAdmin, refreshData, showToast } = useStore();
  const settings = storeService.getSettings();
  const banners = storeService.getBanners();
  const faqs = storeService.getFAQs();
  const activityLogs = storeService.getActivityLogs();

  const [activeSection, setActiveSection] = useState<'store' | 'banners' | 'faqs' | 'policies' | 'security' | 'database'>('store');

  // Store Settings Form
  const [storeName, setStoreName] = useState(settings.storeName || 'Gondal Clothes House');
  const [tagline, setTagline] = useState(settings.tagline || 'Timeless Luxury & Handcrafted Elegance');
  const [phone, setPhone] = useState(settings.phone || '+92 300 1234567');
  const [email, setEmail] = useState(settings.email || 'info@gondalclothes.com');
  const [address, setAddress] = useState(settings.address || 'Main Bazar, Boutique Lane, Gujranwala, Punjab, Pakistan');
  const [deliveryCharges, setDeliveryCharges] = useState<number>(settings.deliveryCharges || 250);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(settings.freeDeliveryThreshold || 5000);
  const [announcementText, setAnnouncementText] = useState(settings.announcementText || 'Complimentary nationwide delivery on orders above Rs. 5,000');
  const [announcementActive, setAnnouncementActive] = useState<boolean>(settings.announcementActive ?? true);

  // Policies
  const [returnPolicy, setReturnPolicy] = useState(settings.returnPolicy || '');
  const [shippingPolicy, setShippingPolicy] = useState(settings.shippingPolicy || '');
  const [privacyPolicy, setPrivacyPolicy] = useState(settings.privacyPolicy || '');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMessage, setSecurityMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Banner modal state
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<StoreBanner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerLink, setBannerLink] = useState('');
  const [bannerActive, setBannerActive] = useState(true);

  // FAQ state
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');

  // DB Import State
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Save Store Settings
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    storeService.saveSettings({
      ...settings,
      storeName: storeName.trim(),
      tagline: tagline.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      deliveryCharges: Number(deliveryCharges) || 0,
      freeDeliveryThreshold: Number(freeDeliveryThreshold) || 0,
      announcementText: announcementText.trim(),
      announcementActive,
      returnPolicy,
      shippingPolicy,
      privacyPolicy,
    });
    refreshData();
    showToast('Store settings updated successfully.');
  };

  // Password change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPassword.length < 6) {
      setSecurityMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    const adminId = currentAdmin?.id || 'admin-master-1';
    const res = storeService.updateAdminPassword(adminId, newPassword);
    if (res.success) {
      setSecurityMessage({ type: 'success', text: 'Admin password updated securely.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Admin password changed successfully.');
    } else {
      setSecurityMessage({ type: 'error', text: res.error || 'Failed to update password.' });
    }
  };

  // Banner Actions
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImage('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400');
    setBannerLink('');
    setBannerActive(true);
    setBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImage.trim()) return;

    storeService.saveBanner({
      id: editingBanner?.id,
      title: bannerTitle.trim(),
      subtitle: bannerSubtitle.trim(),
      imageUrl: bannerImage.trim(),
      linkUrl: bannerLink.trim(),
      isActive: bannerActive,
    });

    refreshData();
    setBannerModalOpen(false);
    showToast(editingBanner ? 'Banner updated.' : 'New showcase banner published.');
  };

  const handleDeleteBanner = (id: string) => {
    storeService.deleteBanner(id);
    refreshData();
    showToast('Banner removed.');
  };

  // FAQ Actions
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    storeService.saveFAQ({
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
    });

    setNewFaqQuestion('');
    setNewFaqAnswer('');
    refreshData();
    showToast('FAQ entry added.');
  };

  const handleDeleteFaq = (id: string) => {
    storeService.deleteFAQ(id);
    refreshData();
    showToast('FAQ entry deleted.');
  };

  // DB Snapshot Export
  const handleExportDB = () => {
    const snapshot = storeService.exportDatabaseSnapshot();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `gondal_clothes_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Database snapshot downloaded successfully.');
  };

  // DB Snapshot Import
  const handleImportDB = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      const success = storeService.importDatabaseSnapshot(parsed);
      if (success) {
        setShowImportModal(false);
        setImportJsonText('');
        refreshData();
        showToast('Database snapshot restored successfully!');
      } else {
        alert('Failed to restore snapshot. Please ensure valid JSON structure.');
      }
    } catch (e: any) {
      alert(`Invalid JSON format: ${e.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-serif text-white">Store Settings &amp; Infrastructure</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Boutique contact information, delivery tariffs, banner carousels, legal policies &amp; database backups.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-800 pb-3 text-xs">
        {[
          { id: 'store', label: 'Boutique Profile', icon: Store },
          { id: 'banners', label: 'Hero Banners', icon: ImageIcon },
          { id: 'faqs', label: 'FAQs Management', icon: HelpCircle },
          { id: 'policies', label: 'Store Policies', icon: FileText },
          { id: 'security', label: 'Admin Security', icon: Shield },
          { id: 'database', label: 'Database & Audit Logs', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-md'
                  : 'bg-stone-900/80 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. STORE PROFILE */}
      {activeSection === 'store' && (
        <form onSubmit={handleSaveStoreSettings} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-sm font-semibold text-white border-b border-stone-800 pb-3 flex items-center space-x-2">
            <Store className="w-4 h-4 text-amber-400" />
            <span>Storefront Contact &amp; Delivery Tariffs</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Boutique Brand Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Brand Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Official WhatsApp &amp; Support Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Official Inquiries Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Physical Boutique Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Delivery Tariffs */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-4">
            <h3 className="text-xs font-semibold text-amber-400 flex items-center space-x-1.5 uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>Nationwide Shipping Rates (Pakistan)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">Standard Courier Flat Rate (PKR)</label>
                <input
                  type="number"
                  value={deliveryCharges}
                  onChange={(e) => setDeliveryCharges(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">Free Shipping Eligibility Threshold (PKR)</label>
                <input
                  type="number"
                  value={freeDeliveryThreshold}
                  onChange={(e) => setFreeDeliveryThreshold(Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Announcement Bar */}
          <div className="p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-200">Top Header Announcement Ribbon</label>
              <label className="flex items-center space-x-2 text-xs text-stone-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="rounded bg-stone-900 border-stone-700 text-amber-600"
                />
                <span>Enable Banner</span>
              </label>
            </div>

            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="e.g. Complimentary nationwide delivery on orders above Rs. 5,000"
              className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Boutique Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. HERO BANNERS */}
      {activeSection === 'banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl">
            <p className="text-xs text-stone-400">
              Manage promotional sliders and full-width boutique campaign visuals on the homepage.
            </p>
            <button
              onClick={handleOpenAddBanner}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map((b) => (
              <div
                key={b.id}
                className="relative bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden shadow-xl group"
              >
                <div className="h-44 relative">
                  <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                      {b.subtitle}
                    </span>
                    <h3 className="font-bold text-white text-base font-serif">{b.title}</h3>
                  </div>
                </div>

                <div className="p-3 bg-stone-950 flex items-center justify-between text-xs">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      b.isActive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    {b.isActive ? 'Live on Store' : 'Inactive'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingBanner(b);
                        setBannerTitle(b.title);
                        setBannerSubtitle(b.subtitle || '');
                        setBannerImage(b.imageUrl);
                        setBannerLink(b.linkUrl || '');
                        setBannerActive(b.isActive);
                        setBannerModalOpen(true);
                      }}
                      className="text-stone-300 hover:text-white px-2.5 py-1 bg-stone-800 rounded-lg text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. FAQS */}
      {activeSection === 'faqs' && (
        <div className="space-y-6">
          {/* Add FAQ Form */}
          <form onSubmit={handleAddFaq} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-stone-800 pb-3 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Add New Frequently Asked Question</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Question</label>
              <input
                type="text"
                value={newFaqQuestion}
                onChange={(e) => setNewFaqQuestion(e.target.value)}
                placeholder="e.g. Do you offer custom unstitched tailoring?"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Answer</label>
              <textarea
                value={newFaqAnswer}
                onChange={(e) => setNewFaqAnswer(e.target.value)}
                rows={3}
                placeholder="Yes, our master craftsmen offer bespoke tailoring tailored exactly to your measurements..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish FAQ</span>
              </button>
            </div>
          </form>

          {/* FAQs List */}
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-stone-100 text-sm flex items-center space-x-2">
                    <span className="text-amber-400 font-bold">Q:</span>
                    <span>{faq.question}</span>
                  </h4>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="text-stone-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-stone-300 pl-5 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. POLICIES */}
      {activeSection === 'policies' && (
        <form onSubmit={handleSaveStoreSettings} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h2 className="text-sm font-semibold text-white border-b border-stone-800 pb-3 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Store Policies &amp; Legal Terms</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Return &amp; Exchange Policy</label>
            <textarea
              value={returnPolicy}
              onChange={(e) => setReturnPolicy(e.target.value)}
              rows={4}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Shipping &amp; Delivery Policy</label>
            <textarea
              value={shippingPolicy}
              onChange={(e) => setShippingPolicy(e.target.value)}
              rows={4}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Privacy Policy</label>
            <textarea
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              rows={4}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Save Policies</span>
            </button>
          </div>
        </form>
      )}

      {/* 5. ADMIN SECURITY */}
      {activeSection === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-5 max-w-md">
          <h2 className="text-sm font-semibold text-white border-b border-stone-800 pb-3 flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Admin Authentication &amp; Credentials</span>
          </h2>

          <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-xs space-y-1">
            <span className="text-stone-500 block">Logged in as:</span>
            <span className="text-amber-400 font-semibold">{currentAdmin?.name || 'Authorized Admin'}</span>
            <span className="text-stone-400 font-mono block text-[11px]">{currentAdmin?.email || 'admin@gondalclothes.com'}</span>
          </div>

          {securityMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center space-x-2 ${
                securityMessage.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-800 text-emerald-300'
                  : 'bg-red-950/70 border border-red-800 text-red-300'
              }`}
            >
              {securityMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{securityMessage.text}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">New Secure Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            Update Admin Password
          </button>
        </form>
      )}

      {/* 6. DATABASE & AUDIT LOGS */}
      {activeSection === 'database' && (
        <div className="space-y-6">
          {/* Backup & Restore Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Download className="w-4 h-4 text-amber-400" />
                <span>Export Full Store Backup</span>
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Download an encrypted, JSON snapshot containing all catalog products, sections, customer accounts, orders, reviews, and boutique settings.
              </p>
              <button
                onClick={handleExportDB}
                className="bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Database (.json)</span>
              </button>
            </div>

            <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-semibold text-white flex items-center space-x-2">
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Restore Snapshot</span>
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Restore or migrate an existing Gondal Clothes House database snapshot.
              </p>
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Paste &amp; Import JSON</span>
              </button>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center space-x-2 border-b border-stone-800 pb-3">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Administrative Activity Audit Trail</span>
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1 text-xs">
              {activityLogs.length === 0 ? (
                <div className="text-center py-6 text-stone-500">No activity recorded yet.</div>
              ) : (
                activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-stone-200">{log.action}</div>
                      <div className="text-[11px] text-stone-400">{log.details}</div>
                      <span className="text-[10px] text-amber-400 font-mono font-medium">
                        By: {log.adminEmail}
                      </span>
                    </div>

                    <div className="text-right text-[10px] text-stone-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-semibold text-white text-base">
              {editingBanner ? 'Edit Banner' : 'Create Hero Showcase Banner'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-medium mb-1">Headline Title</label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. Royal Winter Festive Edit 2026"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Subtitle / Badge</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="e.g. Handcrafted Silk &amp; Pure Velvet"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Background Image URL</label>
                <input
                  type="text"
                  value={bannerImage}
                  onChange={(e) => setBannerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">Target Link URL (Optional)</label>
                <input
                  type="text"
                  value={bannerLink}
                  onChange={(e) => setBannerLink(e.target.value)}
                  placeholder="/#collection or /section/..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerActive}
                  onChange={(e) => setBannerActive(e.target.checked)}
                  className="rounded bg-stone-950 border-stone-800 text-amber-600"
                />
                <span className="text-stone-300">Publish actively on store slider</span>
              </label>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="px-3.5 py-2 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import DB Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-semibold text-white text-base">Import Database Snapshot</h3>
            <p className="text-xs text-amber-400">
              Warning: Importing a snapshot will replace the current local database state.
            </p>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              rows={8}
              placeholder="Paste JSON database payload here..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs font-mono text-stone-200 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleImportDB}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-4 py-1.5 rounded-xl text-xs"
              >
                Execute Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
