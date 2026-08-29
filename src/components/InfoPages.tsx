import React from 'react';
import {
  ChevronRight,
  Home,
  Truck,
  CreditCard,
  RotateCcw,
  ShieldCheck,
  FileText,
  Building,
  Phone,
  Mail,
  MapPin,
  HelpCircle,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface BreadcrumbProps {
  currentPage: string;
}

const PageBreadcrumbs: React.FC<BreadcrumbProps> = ({ currentPage }) => {
  const { goToHome } = useStore();
  return (
    <nav className="flex items-center gap-2 text-xs text-stone-500 mb-6 font-medium">
      <button
        onClick={goToHome}
        className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>
      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
      <span className="text-stone-900 font-semibold">{currentPage}</span>
    </nav>
  );
};

export const AboutView: React.FC = () => {
  const { storeConfig, goToContact, setActiveView } = useStore();

  return (
    <div id="about-us-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageBreadcrumbs currentPage="About Us" />

      <header className="space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200/60">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Our Heritage & Craft</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          About {storeConfig.storeName}
        </h1>
        <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
          {storeConfig.tagline || 'Excellence in fabric selection, master tailoring, and authentic fashion.'}
        </p>
      </header>

      <div className="py-8 space-y-8 text-stone-700 leading-relaxed">
        <div className="prose prose-stone max-w-none">
          <div className="whitespace-pre-line text-stone-700 text-base sm:text-lg leading-relaxed">
            {storeConfig.aboutUsText ||
              `${storeConfig.storeName} is a premier destination for modern Eastern and contemporary pret apparel. We specialize in superior textile curation, artisanal stitching precision, and uncompromised customer satisfaction.`}
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-amber-600" />
            <h3 className="font-semibold text-stone-900 text-base">Pure Quality</h3>
            <p className="text-xs text-stone-600">
              Selected from certified textile mills with uncompromising quality control.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
            <Truck className="w-6 h-6 text-amber-600" />
            <h3 className="font-semibold text-stone-900 text-base">Direct Shipping</h3>
            <p className="text-xs text-stone-600">
              Swift dispatch across all major cities and towns in Pakistan with tracking.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/70 space-y-2">
            <MessageSquare className="w-6 h-6 text-amber-600" />
            <h3 className="font-semibold text-stone-900 text-base">Dedicated Service</h3>
            <p className="text-xs text-stone-600">
              Personalized customer assistance for sizing, fabric inquiries, and order tracking.
            </p>
          </div>
        </div>

        {/* Contact Info Banner */}
        <div className="p-6 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif-heading text-lg font-bold text-white">
              Have questions about our collections?
            </h4>
            <p className="text-xs text-stone-300">
              Our boutique representatives are ready to assist you.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={goToContact}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => setActiveView('sections')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
            >
              Explore Catalog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeliveryInfoView: React.FC = () => {
  const { storeConfig, goToContact } = useStore();

  return (
    <div id="delivery-info-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageBreadcrumbs currentPage="Delivery Information" />

      <header className="space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
          <Truck className="w-3.5 h-3.5 text-stone-600" />
          <span>Nationwide Logistics</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          Delivery & Shipping Information
        </h1>
        <p className="text-stone-600 text-base sm:text-lg">
          Fast, reliable, and insured courier delivery across all Pakistani cities.
        </p>
      </header>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Free Delivery Offer</span>
          <p className="text-2xl font-serif-heading font-bold text-stone-900 mt-1">
            Above {storeConfig.currencySymbol} {storeConfig.freeDeliveryThreshold.toLocaleString()}
          </p>
          <p className="text-xs text-stone-600 mt-1">
            Orders below threshold incur standard shipping fee of {storeConfig.currencySymbol} {storeConfig.deliveryFee}.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Standard Transit Time</span>
          <p className="text-2xl font-serif-heading font-bold text-stone-900 mt-1">
            2 to 4 Working Days
          </p>
          <p className="text-xs text-stone-600 mt-1">
            Express tracking number provided via SMS and order confirmation.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-stone-700 leading-relaxed whitespace-pre-line text-base">
        {storeConfig.deliveryPolicyText || (
          <p>
            All parcels from {storeConfig.storeName} are securely packed and dispatched through premier courier partners (Leopard / Trax / TCS). Deliveries are made during standard business hours Monday through Saturday.
          </p>
        )}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="font-semibold text-stone-900 text-sm">Need urgent or special delivery?</h4>
          <p className="text-xs text-stone-600">Contact our dispatch support team for assistance.</p>
        </div>
        <button
          onClick={goToContact}
          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors"
        >
          Contact Dispatch
        </button>
      </div>
    </div>
  );
};

export const PaymentInfoView: React.FC = () => {
  const { storeConfig, goToContact } = useStore();

  return (
    <div id="payment-info-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageBreadcrumbs currentPage="Payment Information" />

      <header className="space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
          <CreditCard className="w-3.5 h-3.5 text-stone-600" />
          <span>Payment Methods</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          Payment Methods & Security
        </h1>
        <p className="text-stone-600 text-base sm:text-lg">
          Flexible payment options tailored for convenient e-commerce in Pakistan.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8">
        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
            COD
          </div>
          <h3 className="font-semibold text-stone-900 text-base">Cash on Delivery (COD)</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Pay safely with cash directly to the courier rider upon package inspection at your doorstep. Available across all serviceable pin-codes in Pakistan.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold">
            IBFT
          </div>
          <h3 className="font-semibold text-stone-900 text-base">Direct Bank Transfer</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Transfer directly to our official boutique bank account via Raast, online banking, or ATM transfer. Upload or share receipt for instant verification.
          </p>
        </div>
      </div>

      <div className="space-y-6 text-stone-700 leading-relaxed whitespace-pre-line text-base">
        {storeConfig.paymentPolicyText || (
          <p>
            At {storeConfig.storeName}, we prioritize transparent and safe transactions. No hidden surcharges are levied on orders. Invoices are dispatched with every consignment.
          </p>
        )}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="font-semibold text-stone-900 text-sm">Billing Inquiry or Account Details?</h4>
          <p className="text-xs text-stone-600">Reach out to our accounts department.</p>
        </div>
        <button
          onClick={goToContact}
          className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs transition-colors"
        >
          Contact Accounts
        </button>
      </div>
    </div>
  );
};

export const ReturnsView: React.FC = () => {
  const { storeConfig, goToContact } = useStore();

  return (
    <div id="returns-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageBreadcrumbs currentPage="Return & Exchange" />

      <header className="space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
          <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
          <span>Customer Guarantee</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          Return & Exchange Policy
        </h1>
        <p className="text-stone-600 text-base sm:text-lg">
          Clear, hassle-free 7-day exchange window for our esteemed clients.
        </p>
      </header>

      <div className="my-8 p-6 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
        <h3 className="font-semibold text-amber-950 text-sm">7-Day Hassle-Free Exchange Window</h3>
        <p className="text-xs text-amber-900/80 leading-relaxed">
          If you receive an item with sizing discrepancy, manufacturing defect, or wrong parcel, initiate an exchange request within 7 calendar days of parcel delivery.
        </p>
      </div>

      <div className="space-y-6 text-stone-700 leading-relaxed whitespace-pre-line text-base">
        {storeConfig.returnPolicyText || (
          <p>
            Items must be unworn, unwashed, and returned with original tags intact. Custom tailored or altered items may have limited exchange terms.
          </p>
        )}
      </div>

      <div className="mt-10 p-6 rounded-2xl bg-stone-900 text-white flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="font-semibold text-white text-sm">Initiate an Exchange or Return</h4>
          <p className="text-xs text-stone-300">Provide your order number and item details to begin.</p>
        </div>
        <button
          onClick={goToContact}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors"
        >
          Submit Return Request
        </button>
      </div>
    </div>
  );
};

export const PrivacyView: React.FC = () => {
  const { storeConfig } = useStore();

  return (
    <div id="privacy-policy-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageBreadcrumbs currentPage="Privacy Policy" />

      <header className="space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
          <span>Data Protection</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          Privacy Policy
        </h1>
        <p className="text-stone-600 text-base sm:text-lg">
          How {storeConfig.storeName} protects and handles your personal information.
        </p>
      </header>

      <div className="py-8 space-y-6 text-stone-700 leading-relaxed whitespace-pre-line text-base">
        {storeConfig.privacyPolicyText || (
          <p>
            We take your privacy seriously. Your contact information, shipping addresses, and purchase history are utilized strictly for order processing, logistics coordination, and customer support. We do not sell or lease customer information to third-party marketers.
          </p>
        )}
      </div>
    </div>
  );
};

export const TermsView: React.FC = () => {
  const { storeConfig } = useStore();

  return (
    <div id="terms-conditions-page" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageBreadcrumbs currentPage="Terms & Conditions" />

      <header className="space-y-3 pb-8 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5 text-stone-600" />
          <span>Store Agreement</span>
        </div>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-stone-900">
          Terms & Conditions
        </h1>
        <p className="text-stone-600 text-base sm:text-lg">
          Guidelines and terms governing use of the {storeConfig.storeName} storefront.
        </p>
      </header>

      <div className="py-8 space-y-6 text-stone-700 leading-relaxed whitespace-pre-line text-base">
        {storeConfig.termsConditionsText || (
          <p>
            By browsing or placing an order on {storeConfig.storeName}, you agree to our standard shopping terms, transparent pricing in Pakistani Rupees (PKR), and fair use of customer accounts.
          </p>
        )}
      </div>
    </div>
  );
};
