/**
 * Gondal Clothes House - Admin Messages / Customer Inbox Tab
 * Manage customer inquiries, order assistance requests & direct boutique responses
 */

import React, { useState } from 'react';
import {
  Mail,
  Search,
  Phone,
  Send,
  Trash2,
  CheckCircle2,
  Clock,
  User,
  MessageSquare,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../../../context/StoreContext';
import { storeService } from '../../../services/storeService';
import { CustomerMessage } from '../../../types';

export const AdminMessagesTab: React.FC = () => {
  const { refreshData, showToast } = useStore();
  const messages = storeService.getMessages();

  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'replied' | 'read'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const handleSelectMessage = (msg: CustomerMessage) => {
    setSelectedMessage(msg);
    setReplyText(msg.reply || '');
    if (msg.status === 'unread') {
      storeService.updateMessageStatus(msg.id, 'read');
      refreshData();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyText.trim()) return;

    setSendingReply(true);
    try {
      const updated = storeService.replyToCustomerMessage(selectedMessage.id, replyText.trim());
      if (updated) {
        setSelectedMessage(updated);
        refreshData();
        showToast('Reply dispatched and notification created for customer.');
      }
    } finally {
      setSendingReply(false);
    }
  };

  const handleDeleteMessage = (msgId: string) => {
    storeService.deleteMessage(msgId);
    if (selectedMessage?.id === msgId) {
      setSelectedMessage(null);
    }
    refreshData();
    showToast('Inquiry removed from inbox.');
  };

  const filteredMessages = messages.filter((m) => {
    if (statusFilter !== 'all' && m.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchPhone = m.phone.toLowerCase().includes(q);
      const matchEmail = m.email.toLowerCase().includes(q);
      const matchMsg = m.message.toLowerCase().includes(q);
      const matchOrder = m.orderNumber?.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchMsg && !matchOrder) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-bold font-serif text-white">Customer Support Inbox</h1>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Total {messages.length} inquiries &bull;{' '}
            <span className="text-amber-400 font-medium">
              {messages.filter((m) => m.status === 'unread').length} unread
            </span>
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'all' ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setStatusFilter('unread')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'unread' ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-400'
            }`}
          >
            Unread ({messages.filter((m) => m.status === 'unread').length})
          </button>
          <button
            onClick={() => setStatusFilter('replied')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              statusFilter === 'replied' ? 'bg-emerald-600 text-white font-bold' : 'bg-stone-800 text-stone-400'
            }`}
          >
            Replied ({messages.filter((m) => m.status === 'replied').length})
          </button>
        </div>
      </div>

      {/* Main Split: Inbox List Left, Thread Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List (1 col) */}
        <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inquiries..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-xs text-stone-500">
                No inquiries matching filter.
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleSelectMessage(msg)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer text-xs space-y-1.5 ${
                    selectedMessage?.id === msg.id
                      ? 'bg-amber-950/30 border-amber-500/60'
                      : msg.status === 'unread'
                      ? 'bg-stone-950 border-amber-500/30'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-200 truncate">{msg.name}</span>
                    <span className="text-[10px] text-stone-500">
                      {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="text-[11px] text-stone-400 font-mono">{msg.phone}</div>

                  <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full capitalize font-semibold ${
                        msg.status === 'unread'
                          ? 'bg-amber-500/20 text-amber-300'
                          : msg.status === 'replied'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {msg.status}
                    </span>

                    {msg.orderNumber && (
                      <span className="text-[10px] text-amber-400 font-mono">
                        Ref: {msg.orderNumber}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details & Reply Box (2 cols) */}
        <div className="lg:col-span-2 bg-stone-900/80 border border-stone-800 rounded-2xl p-6 shadow-xl">
          {!selectedMessage ? (
            <div className="text-center py-24 text-stone-500">
              <Mail className="w-12 h-12 mx-auto mb-2 text-stone-700" />
              <p className="text-xs">Select a customer inquiry on the left to read and send replies.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-stone-800 pb-4">
                <div>
                  <h3 className="text-base font-semibold text-white">{selectedMessage.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400 mt-1">
                    <span className="font-mono text-amber-400">{selectedMessage.phone}</span>
                    <span>&bull;</span>
                    <span>{selectedMessage.email}</span>
                    <span>&bull;</span>
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                  {selectedMessage.orderNumber && (
                    <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Order Reference: {selectedMessage.orderNumber}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="text-stone-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-stone-800"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Message Content */}
              <div className="p-4 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-200 leading-relaxed space-y-2">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                  Customer Message:
                </span>
                <p className="text-sm">{selectedMessage.message}</p>
              </div>

              {/* Existing Reply if any */}
              {selectedMessage.reply && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl text-xs text-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-emerald-400 font-semibold uppercase">
                    <span>Sent Boutique Reply:</span>
                    <span>{selectedMessage.replyDate ? new Date(selectedMessage.replyDate).toLocaleString() : ''}</span>
                  </div>
                  <p className="text-sm text-emerald-100">{selectedMessage.reply}</p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-stone-300">
                  {selectedMessage.reply ? 'Send New / Updated Response' : 'Compose Official Response'}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Dear customer, thank you for reaching out to Gondal Clothes House..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-4 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  required
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    Replies are instantly logged and linked to the customer account.
                  </span>
                  <button
                    type="submit"
                    disabled={sendingReply}
                    className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{sendingReply ? 'Sending...' : 'Dispatch Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
