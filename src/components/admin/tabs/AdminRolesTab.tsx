/**
 * Gondal Clothes House - Super Admin & User Roles Control Center
 * Complete Owner Control, RBAC Matrix, Admin Account Management, Security & Database Backups
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  KeyRound,
  Users,
  UserCheck,
  UserX,
  Lock,
  Download,
  Upload,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  FileJson,
  Activity,
  Search,
  Eye,
  EyeOff,
  Sparkles,
  Server,
  Globe,
  Database,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { AdminUser, AdminRole, User } from '../../../types';

export const AdminRolesTab: React.FC = () => {
  const { currentAdmin, refreshData, showToast } = useStore();

  const [activeSubSection, setActiveSubSection] = useState<'matrix' | 'admins' | 'security' | 'customers' | 'backups' | 'audit'>('matrix');

  // Admin users list
  const adminUsers = storeService.getAdminUsers();
  const registeredUsers = storeService.getUsers();
  const activityLogs = storeService.getActivityLogs();

  // New/Edit Admin Modal State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminRole, setAdminRole] = useState<AdminRole>('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminIsActive, setAdminIsActive] = useState(true);
  const [adminFormError, setAdminFormError] = useState<string | null>(null);

  // Super Admin Password Change State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassFields, setShowPassFields] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Backup & Restore State
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  // Search filter for customers & audit logs
  const [customerSearch, setCustomerSearch] = useState('');
  const [auditFilter, setAuditFilter] = useState<string>('all');

  const isSuperAdmin = storeService.isSuperAdmin(currentAdmin);

  // Handle Open Create Admin
  const handleOpenCreateAdmin = () => {
    setEditingAdmin(null);
    setAdminUsername('');
    setAdminName('');
    setAdminEmail('');
    setAdminRole('admin');
    setAdminPassword('');
    setAdminIsActive(true);
    setAdminFormError(null);
    setAdminModalOpen(true);
  };

  // Handle Open Edit Admin
  const handleOpenEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setAdminUsername(admin.username);
    setAdminName(admin.name);
    setAdminEmail(admin.email);
    setAdminRole(admin.role);
    setAdminPassword('');
    setAdminIsActive(admin.isActive);
    setAdminFormError(null);
    setAdminModalOpen(true);
  };

  // Save Admin Account
  const handleSaveAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminEmail.trim() || !adminName.trim()) {
      setAdminFormError('Please fill in username, full name, and email address.');
      return;
    }

    if (!editingAdmin && (!adminPassword || adminPassword.length < 4)) {
      setAdminFormError('Initial password must be at least 4 characters long.');
      return;
    }

    try {
      const saved = storeService.saveAdminUser({
        id: editingAdmin?.id,
        username: adminUsername.trim(),
        name: adminName.trim(),
        email: adminEmail.trim().toLowerCase(),
        role: adminRole,
        isActive: adminIsActive,
      });

      if (adminPassword) {
        storeService.updateAdminPassword(saved.id, adminPassword);
      }

      setAdminModalOpen(false);
      refreshData();
      showToast(`Administrator account "${saved.name}" saved successfully.`);
    } catch (err: any) {
      setAdminFormError(err.message || 'Failed to save administrator account.');
    }
  };

  // Delete Admin Account
  const handleDeleteAdmin = (adminId: string, adminName: string) => {
    if (!window.confirm(`Are you sure you want to remove the administrator account for "${adminName}"?`)) {
      return;
    }

    const res = storeService.deleteAdminUser(adminId);
    if (!res.success) {
      alert(res.error || 'Cannot remove administrator.');
      return;
    }

    refreshData();
    showToast(`Administrator account "${adminName}" was removed.`);
  };

  // Toggle Admin Active Status
  const handleToggleAdminStatus = (admin: AdminUser) => {
    if (admin.role === 'super_admin' && admin.isActive) {
      const superAdmins = adminUsers.filter((a) => a.role === 'super_admin' && a.isActive);
      if (superAdmins.length <= 1) {
        alert('Cannot deactivate the primary Super Administrator account.');
        return;
      }
    }

    storeService.saveAdminUser({
      ...admin,
      isActive: !admin.isActive,
    });
    refreshData();
    showToast(`Status updated for ${admin.name}.`);
  };

  // Super Admin Password Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);

    if (!currentAdmin) return;

    if (!newPass || newPass.length < 4) {
      setSecurityStatus({ type: 'error', message: 'New password must be at least 4 characters.' });
      return;
    }

    if (newPass !== confirmPass) {
      setSecurityStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    const res = storeService.updateAdminPassword(currentAdmin.id, newPass);
    if (res.success) {
      setSecurityStatus({ type: 'success', message: 'Master Super Admin password updated successfully!' });
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      showToast('Super Admin password updated securely.');
    } else {
      setSecurityStatus({ type: 'error', message: res.error || 'Failed to update password.' });
    }
  };

  // Export JSON Database Backup
  const handleDownloadBackup = () => {
    const jsonStr = storeService.exportDatabaseSnapshot();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    a.download = `gondal-clothes-house-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Full database snapshot downloaded successfully.');
  };

  // Import JSON Database Backup
  const handleImportBackup = (e: React.FormEvent) => {
    e.preventDefault();
    setImportError(null);

    if (!importJsonText.trim()) {
      setImportError('Please paste valid JSON backup content.');
      return;
    }

    const res = storeService.importDatabaseSnapshot(importJsonText.trim());
    if (res.success) {
      setShowImportModal(false);
      setImportJsonText('');
      refreshData();
      showToast('Store database restored successfully from snapshot.');
    } else {
      setImportError(res.error || 'Failed to import backup. Please check format.');
    }
  };

  // Reset Database
  const handleConfirmReset = () => {
    storeService.resetDatabaseToCleanState();
    setShowResetConfirmModal(false);
    refreshData();
    showToast('Store database reset to fresh blank state. Super Admin account preserved.');
  };

  // Filtered customers
  const filteredCustomers = registeredUsers.filter((u) => {
    const q = customerSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  });

  // Filtered audit logs
  const filteredLogs = activityLogs.filter((log) => {
    if (auditFilter === 'all') return true;
    return log.category === auditFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Super Admin & Ownership Declaration */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Website Owner &amp; Super Admin Authority</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Roles &amp; Complete Owner Control
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              The website owner retains full ownership and sovereignty over the domain, hosting, persistent database,
              media storage, product catalogue, order pipelines, and master administrator account.
            </p>
          </div>

          <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-4 flex items-center space-x-3.5 shrink-0 shadow-inner">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shadow-lg shadow-amber-950/50">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-bold text-white">{currentAdmin?.name || 'Administrator'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold uppercase tracking-wider">
                  {currentAdmin?.role || 'super_admin'}
                </span>
              </div>
              <span className="text-xs text-stone-400 font-mono block mt-0.5">{currentAdmin?.email}</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 mt-6 pt-5 border-t border-stone-800/80 overflow-x-auto pb-1">
          {[
            { id: 'matrix', label: 'Access Matrix', icon: ShieldCheck },
            { id: 'admins', label: `Admin Accounts (${adminUsers.length})`, icon: Users },
            { id: 'security', label: 'Owner Password', icon: KeyRound },
            { id: 'customers', label: `Customer CRM (${registeredUsers.length})`, icon: UserCheck },
            { id: 'backups', label: 'Database & Backups', icon: Database },
            { id: 'audit', label: 'Audit Trail', icon: Activity },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubSection(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/40'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUB-SECTION 1: ROLE ACCESS CONTROL MATRIX */}
      {activeSubSection === 'matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Super Admin Capabilities Card */}
            <div className="bg-stone-900/90 border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Super Admin (Website Owner)</h3>
                  <span className="text-xs text-amber-400 font-medium">Role: super_admin • Complete Authority</span>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                The authenticated owner has absolute read, write, edit, and delete permissions across all store modules:
              </p>

              <ul className="space-y-2 text-xs text-stone-300">
                {[
                  'Add, edit, duplicate, and delete products with rich attributes & stock',
                  'Create, reorder, hide, and customize Men, Women, Kids & custom categories',
                  'Upload product photography, high-resolution videos, and banner assets',
                  'Update retail prices, discounts, and real-time inventory levels',
                  'Manage homepage hero banners, promotional sliders, and announcement tickers',
                  'Full Order Pipeline: Inspect customer orders, update tracking numbers & dispatch status',
                  'Customer CRM: View profiles, communication history, and respond to inquiries',
                  'Moderate customer reviews, product ratings, and Q&A submissions',
                  'Modify boutique contact details, address, Google Maps location, and store policies',
                  'Manage administrator accounts, assign roles, and change master passwords',
                  '1-Click Full Website Database Backup, Disaster Recovery Restore, and JSON Data Export',
                ].map((cap, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Normal Customer Capabilities & Restrictions Card */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-white">Normal Customer</h3>
                  <span className="text-xs text-stone-400 font-medium">Role: customer • Storefront Access Only</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">
                    Permitted Public Actions:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {[
                      'Browse homepage, hero banners, and promotional collections',
                      'Filter and browse Men, Women, Kids, and seasonal sections',
                      'Search products by keyword, category, price, and attributes',
                      'View product detail pages, multi-angle photos, and videos',
                      'Check prices, discounts, stock availability, and size guides',
                      'Add items to cart and place COD or Direct Bank Transfer orders',
                      'Track their own orders in real time using their Order ID',
                      'Submit customer service inquiries, reviews, and product questions',
                      'View store physical location, contact info, FAQs, and policies',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-stone-800">
                  <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-1.5">
                    Strictly Forbidden &amp; Blocked:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-400">
                    {[
                      'Cannot access Admin Panel or administrative routes',
                      'Cannot add, modify, or delete products or categories',
                      'Cannot alter pricing, discount percentages, or stock levels',
                      'Cannot view orders, personal details, or addresses of other customers',
                      'Cannot access backend database, settings, or server configurations',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <UserX className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 2: ADMIN ACCOUNTS & PERMISSIONS */}
      {activeSubSection === 'admins' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-xl">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Administrator &amp; Staff Accounts</h3>
              <p className="text-xs text-stone-400">
                Manage backend team members and assign role-based administrative permissions.
              </p>
            </div>

            <button
              onClick={handleOpenCreateAdmin}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/40 transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Administrator</span>
            </button>
          </div>

          {/* Admin Users Table */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">User Details</th>
                    <th className="py-3.5 px-4 font-semibold">Role</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Last Login</th>
                    <th className="py-3.5 px-4 font-semibold">Created</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60">
                  {adminUsers.map((admin) => {
                    const isSelf = currentAdmin?.id === admin.id;
                    const isSuper = admin.role === 'super_admin';

                    return (
                      <tr key={admin.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSuper ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-stone-200'
                            }`}>
                              {admin.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-white flex items-center space-x-1.5">
                                <span>{admin.name}</span>
                                {isSelf && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-stone-400 font-mono">{admin.email}</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isSuper
                                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                                : admin.role === 'admin'
                                ? 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                                : 'bg-stone-800 border border-stone-700 text-stone-300'
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            <span>{admin.role}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleAdminStatus(admin)}
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors ${
                              admin.isActive
                                ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/60'
                                : 'bg-red-950/50 text-red-300 border border-red-800/60'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${admin.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                            <span>{admin.isActive ? 'Active' : 'Suspended'}</span>
                          </button>
                        </td>

                        <td className="py-3.5 px-4 text-stone-400">
                          {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never'}
                        </td>

                        <td className="py-3.5 px-4 text-stone-500">
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleOpenEditAdmin(admin)}
                              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                              title="Edit Administrator"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors"
                              title="Remove Administrator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-SECTION 3: SUPER ADMIN PASSWORD & SECURITY */}
      {activeSubSection === 'security' && (
        <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Super Admin Password &amp; Master Key</h3>
              <p className="text-xs text-stone-400">
                Update the master administrative credentials for the website owner.
              </p>
            </div>
          </div>

          {securityStatus && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-start space-x-2.5 ${
                securityStatus.type === 'success'
                  ? 'bg-emerald-950/50 border border-emerald-800/60 text-emerald-300'
                  : 'bg-red-950/50 border border-red-800/60 text-red-300'
              }`}
            >
              {securityStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span>{securityStatus.message}</span>
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                New Super Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassFields ? 'text' : 'password'}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassFields(!showPassFields)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassFields ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type={showPassFields ? 'text' : 'password'}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-950/40 flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Save New Super Admin Password</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-SECTION 4: CUSTOMER CRM DIRECTORY */}
      {activeSubSection === 'customers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-xl">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Registered Customer Accounts</h3>
              <p className="text-xs text-stone-400">
                Customer profiles with restricted storefront permissions.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-500" />
              <input
                type="text"
                placeholder="Search customers..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                {registeredUsers.length === 0
                  ? 'No customer accounts registered yet. Normal users can register on the public storefront.'
                  : 'No customer accounts match your search query.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Customer</th>
                      <th className="py-3.5 px-4 font-semibold">Contact</th>
                      <th className="py-3.5 px-4 font-semibold">Role</th>
                      <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                      <th className="py-3.5 px-4 font-semibold">Saved Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredCustomers.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-stone-300 font-mono">{user.email}</div>
                          <div className="text-[11px] text-stone-500">{user.phone}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-300 text-[10px] font-medium">
                            customer (restricted)
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-stone-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-stone-400">
                          {user.address ? `${user.address.city}, ${user.address.address}` : 'No address saved'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-SECTION 5: DATABASE BACKUPS & RESTORE */}
      {activeSubSection === 'backups' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Backup Generator Card */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">Full Website Database Backup</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Generate a complete, self-contained JSON snapshot containing all store configuration, hero banners,
                  sections, products, orders, reviews, inquiries, customer profiles, and audit records.
                </p>
              </div>

              <button
                onClick={handleDownloadBackup}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-xs transition-colors shadow-lg shadow-amber-950/40 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Database Snapshot (.json)</span>
              </button>
            </div>

            {/* Restore Database Card */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif font-bold text-white">Disaster Recovery Restore</h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Restore your entire boutique database from a previously generated JSON backup snapshot.
                  All products, categories, orders, and configurations will be restored instantly.
                </p>
              </div>

              <button
                onClick={() => setShowImportModal(true)}
                className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-white font-semibold rounded-xl text-xs transition-colors border border-stone-700 flex items-center justify-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Restore Snapshot From JSON</span>
              </button>
            </div>
          </div>

          {/* Database Reset Danger Zone */}
          <div className="bg-red-950/20 border border-red-900/40 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-serif font-bold">Clean Slate Database Reset</h3>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Resets sections, products, orders, reviews, and inquiries to an empty state. Your Super Administrator
              account and master password will be safely preserved.
            </p>
            <button
              onClick={() => setShowResetConfirmModal(true)}
              className="px-4 py-2 bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Database to Clean State
            </button>
          </div>
        </div>
      )}

      {/* SUB-SECTION 6: AUDIT LOGS */}
      {activeSubSection === 'audit' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/90 border border-stone-800 rounded-3xl p-5 shadow-xl">
            <div>
              <h3 className="text-lg font-serif font-bold text-white">Administrative Activity Audit Trail</h3>
              <p className="text-xs text-stone-400">
                Cryptographically tracked log of all administrative actions, status changes, and database edits.
              </p>
            </div>

            <select
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Categories</option>
              <option value="product">Products</option>
              <option value="section">Sections</option>
              <option value="order">Orders</option>
              <option value="auth">Authentication &amp; Users</option>
              <option value="setting">Store Settings</option>
            </select>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No activity logs recorded for this category yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950/60 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Timestamp</th>
                      <th className="py-3 px-4 font-semibold">Administrator</th>
                      <th className="py-3 px-4 font-semibold">Action</th>
                      <th className="py-3 px-4 font-semibold">Category</th>
                      <th className="py-3 px-4 font-semibold">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/60">
                    {filteredLogs.slice(0, 100).map((log) => (
                      <tr key={log.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {log.adminName || 'Super Admin'}
                        </td>
                        <td className="py-3 px-4 text-amber-400 font-medium">{log.action}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 text-[10px] font-mono uppercase">
                            {log.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-stone-300">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT ADMIN MODAL */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-serif font-bold text-white">
                {editingAdmin ? 'Edit Administrator Profile' : 'Add New Administrator'}
              </h3>
              <button onClick={() => setAdminModalOpen(false)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            {adminFormError && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs">
                {adminFormError}
              </div>
            )}

            <form onSubmit={handleSaveAdmin} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="e.g. Asad Gondal"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Username (Login ID)</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="e.g. asad_admin"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="e.g. asad@gondalclothes.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Role &amp; Privilege Level</label>
                <select
                  value={adminRole}
                  onChange={(e) => setAdminRole(e.target.value as AdminRole)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="super_admin">Super Admin (Website Owner - Full Access)</option>
                  <option value="admin">Administrator (Catalogue, Orders, CRM)</option>
                  <option value="staff">Staff (Orders &amp; Inquiry Assistance)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  {editingAdmin ? 'New Password (Leave empty to keep existing)' : 'Initial Password'}
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={editingAdmin ? '••••••••' : 'Minimum 4 characters'}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="adminActiveCheck"
                  checked={adminIsActive}
                  onChange={(e) => setAdminIsActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-0"
                />
                <label htmlFor="adminActiveCheck" className="text-stone-300">
                  Account is active and permitted to authenticate
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT JSON SNAPSHOT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-serif font-bold text-white">Restore Database Snapshot</h3>
              <button onClick={() => setShowImportModal(false)} className="text-stone-400 hover:text-white">
                ✕
              </button>
            </div>

            {importError && (
              <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs">
                {importError}
              </div>
            )}

            <form onSubmit={handleImportBackup} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">
                  Paste JSON Snapshot Content
                </label>
                <textarea
                  rows={8}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste the raw JSON from your backup file here..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-white font-mono text-[11px] placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl"
                >
                  Restore State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET CONFIRMATION MODAL */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-900/50 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 text-xs">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-serif font-bold text-white">Confirm Clean State Reset</h3>
            </div>

            <p className="text-stone-300 leading-relaxed">
              Are you certain you want to clear all product listings, sections, orders, and customer messages?
              This action cannot be undone unless you have downloaded a JSON backup.
            </p>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-800">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl"
              >
                Yes, Reset Database
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
