import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactView: React.FC = () => {
  const { storeConfig, sendContactMessage, currentUser, contactPrefillOrderNumber } = useStore();

  const [name, setName] = useState<string>(currentUser?.name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [email, setEmail] = useState<string>(currentUser?.email || '');
  const [message, setMessage] = useState<string>(
    contactPrefillOrderNumber ? `Inquiry regarding Order #${contactPrefillOrderNumber}:\n` : ''
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await sendContactMessage(name, phone, email, message);
      setIsSubmitted(true);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gondal Clothes House Concierge</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          Contact Our Boutique
        </h1>
        <p className="text-sm text-stone-600 leading-relaxed">
          Have an inquiry regarding our clothing collections, bespoke tailoring, fabric materials, or size measurements? Reach out to our customer care team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Store Information Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 text-white shadow-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-stone-900 flex items-center justify-center font-serif font-bold text-lg">
                G
              </div>
              <div>
                <h3 className="font-serif-heading font-bold text-lg text-white">
                  {storeConfig.storeName}
                </h3>
                <span className="text-xs text-amber-400 font-medium">{storeConfig.tagline}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs text-stone-300 pt-2 border-t border-stone-800">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Physical Location:</span>
                  <span>{storeConfig.address}, {storeConfig.city}, {storeConfig.country}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Direct Phone / WhatsApp:</span>
                  <span>{storeConfig.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Official Email:</span>
                  <span>{storeConfig.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white block">Business & Showroom Hours:</span>
                  <span>{storeConfig.businessHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Messages are securely dispatched directly to the store management.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Message Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200 shadow-xs space-y-6">
            <div>
              <h2 className="font-serif-heading text-xl font-bold text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <span>Send a Message to Store</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Fill out the form below and our store representative will get in touch with you.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3 animate-in fade-in duration-200">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-stone-900 text-sm">Message Sent Successfully!</h3>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  Thank you for writing to Gondal Clothes House. Our team has received your communication.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muhammad Ahmad"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email / Gmail Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ahmad@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify size requirements, unstitched suit orders, custom tailoring, or general questions..."
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
