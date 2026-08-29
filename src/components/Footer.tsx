import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RefreshCw,
  Award,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const {
    storeConfig,
    goToHome,
    goToContact,
    goToAccount,
    goToAbout,
    goToDeliveryInfo,
    goToPaymentInfo,
    goToReturns,
    goToPrivacy,
    goToTerms,
    goToFAQ,
    goToAdminLogin,
    setActiveView,
  } = useStore();

  return (
    <footer id="site-footer" className="bg-stone-900 text-stone-300 pt-14 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-stone-800 rounded-xl text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Nationwide Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Reliable doorstep shipping across Pakistan.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-stone-800 rounded-xl text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Premium Quality</h4>
              <p className="text-xs text-stone-400 mt-0.5">Finest fabrics and bespoke tailoring precision.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-stone-800 rounded-xl text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Cash on Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Inspect & pay at your doorstep with confidence.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-stone-800 rounded-xl text-amber-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">7-Day Exchanges</h4>
              <p className="text-xs text-stone-400 mt-0.5">Hassle-free size and product exchange support.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 py-12">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-stone-900 flex items-center justify-center font-serif font-bold text-lg">
                G
              </div>
              <span className="font-serif-heading font-bold text-xl text-white tracking-tight">
                {storeConfig.storeName}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Discover timeless elegance and contemporary designs. Gondal Clothes House offers premium unstitched fabrics and bespoke stitched wear for every occasion.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{storeConfig.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Explore</h5>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>
                <button onClick={goToHome} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('sections')} className="hover:text-white transition-colors">
                  All Collections
                </button>
              </li>
              <li>
                <button onClick={goToAbout} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={goToFAQ} className="hover:text-white transition-colors">
                  FAQ Desk
                </button>
              </li>
              <li>
                <button onClick={goToContact} className="hover:text-white transition-colors">
                  Contact Boutique
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Store Policies</h5>
            <ul className="text-xs space-y-2 text-stone-400">
              <li>
                <button onClick={goToDeliveryInfo} className="hover:text-white transition-colors">
                  Delivery Information
                </button>
              </li>
              <li>
                <button onClick={goToPaymentInfo} className="hover:text-white transition-colors">
                  Payment Methods & COD
                </button>
              </li>
              <li>
                <button onClick={goToReturns} className="hover:text-white transition-colors">
                  Return & Exchange Policy
                </button>
              </li>
              <li>
                <button onClick={goToPrivacy} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={goToTerms} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Store Address & Contact */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-white">Get in Touch</h5>
            <div className="text-xs text-stone-400 space-y-2.5">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{storeConfig.address}, {storeConfig.city}, {storeConfig.country}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{storeConfig.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{storeConfig.email}</span>
              </p>
              <div className="pt-2">
                <button
                  onClick={goToAccount}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors inline-block"
                >
                  My Account & Orders
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-stone-800 text-center sm:flex sm:justify-between sm:text-left text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {storeConfig.storeName}. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex items-center gap-4 justify-center sm:justify-end">
            <button onClick={goToPrivacy} className="hover:text-stone-400 transition-colors">Privacy</button>
            <span>•</span>
            <button onClick={goToTerms} className="hover:text-stone-400 transition-colors">Terms</button>
            <span>•</span>
            <button onClick={goToFAQ} className="hover:text-stone-400 transition-colors">FAQ</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

