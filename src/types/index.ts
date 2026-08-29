/**
 * Gondal Clothes House - Data Architecture & Scalable Type Definitions
 * Scalable schema prepared for customer storefront (Parts 1-5) and Admin Panel (Part 6)
 */

export interface UserAddress {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  area: string;
  postalCode: string;
  instructions?: string;
}

export interface SavedAddress {
  id: string;
  userId?: string;
  label?: string;
  fullName: string;
  phone: string;
  email: string;
  country?: string;
  city: string;
  area: string;
  address: string;
  postalCode: string;
  instructions?: string;
  isDefault: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'super_admin' | 'admin';
  address?: UserAddress;
  createdAt: string;
  updatedAt: string;
  passwordHash?: string;
}

export type SectionStatus = 'published' | 'draft';
export type SectionVisibility = 'public' | 'hidden';

export interface Section {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner?: string;
  bannerImage?: string;
  videoUrl?: string;
  allowComments?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  status: SectionStatus;
  visibility: SectionVisibility;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSize {
  name: string;
  inStock?: boolean;
  stock?: number;
}

export interface ProductMediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  isMain?: boolean;
  sortOrder?: number;
  sizeBytes?: number;
  mimeType?: string;
}

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  sectionId: string;
  sectionName?: string;
  title: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  fabricDetails?: string;
  careInstructions?: string;
  allowComments?: boolean;
  images: string[];
  media?: ProductMediaItem[];
  video?: string;
  videoUrl?: string;
  price: number;
  discount?: number; // percentage, e.g. 15 for 15% off
  originalPrice?: number;
  sizes: string[];
  colors: ProductColor[];
  stock: number;
  sku: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  status: ProductStatus;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item id (e.g. productId_size_color)
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export type PaymentMethod = 'cod' | 'online' | 'bank_transfer';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  image: string;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  sku?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionRef?: string;
  receiptUrl?: string;
  bankName?: string;
  accountTitle?: string;
  notes?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  idempotencyKey?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: UserAddress;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransaction?: PaymentTransaction;
  status: OrderStatus;
  statusHistory?: OrderStatusHistoryItem[];
  cancellationReason?: string;
  notes?: string;
  courierName?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CommentStatus = 'approved' | 'pending' | 'rejected';

export interface Comment {
  id: string;
  productId: string;
  customerId?: string;
  customerName: string;
  comment: string;
  rating: number; // 1 to 5
  status: CommentStatus;
  isVerifiedPurchase?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductQuestion {
  id: string;
  productId: string;
  customerId?: string;
  customerName: string;
  authorName?: string;
  question: string;
  answer?: string;
  answeredAt?: string;
  createdAt: string;
}

export type MessageStatus = 'unread' | 'read' | 'replied' | 'closed';

export interface CustomerMessage {
  id: string;
  customerId?: string;
  name: string;
  phone: string;
  email: string;
  subject?: string;
  orderNumber?: string;
  message: string;
  reply?: string;
  replyDate?: string;
  status: MessageStatus;
  createdAt: string;
}

export type NotificationType = 'order' | 'message' | 'system' | 'review';

export interface CustomerNotification {
  id: string;
  customerId?: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedId?: string; // e.g. orderId
  isRead: boolean;
  createdAt: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  linkUrl?: string;
  imageUrl: string;
  videoUrl?: string;
  badge?: string;
  sortOrder?: number;
  isActive: boolean;
}

export type StoreBanner = HeroBanner;

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: 'General' | 'Orders & Delivery' | 'Sizing & Fabric' | 'Payments' | 'Returns & Exchanges';
  sortOrder?: number;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;
  tiktok?: string;
}

export interface BankDetails {
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  raastId?: string;
  instructions?: string;
}

export interface CourierSettings {
  defaultPartner: string;
  trackingBaseUrl: string;
  expressDeliveryAvailable: boolean;
  expressDeliveryFee: number;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  themeStyle: 'classic' | 'luxury' | 'minimal';
}

export interface StoreConfig {
  storeName: string;
  tagline: string;
  logoText: string;
  logoSubtitle: string;
  logoUrl?: string;
  phone: string;
  whatsappNumber?: string;
  email: string;
  address: string;
  city: string;
  country: string;
  businessHours: string;
  currency: string;
  currencySymbol: string;
  deliveryFee: number;
  deliveryCharges?: number;
  freeDeliveryThreshold: number;
  allowOnlinePayment: boolean;
  announcementText: string;
  announcementActive?: boolean;
  showAnnouncement?: boolean;
  announcementLink?: string;
  announcementBtnText?: string;
  socialLinks?: SocialLinks;
  bankDetails?: BankDetails;
  courierSettings?: CourierSettings;
  themeSettings?: ThemeSettings;
  aboutUsText?: string;
  deliveryPolicyText?: string;
  shippingPolicy?: string;
  paymentPolicyText?: string;
  returnPolicyText?: string;
  returnPolicy?: string;
  privacyPolicyText?: string;
  privacyPolicy?: string;
  termsConditionsText?: string;
  faqs?: FAQItem[];
  banners?: HeroBanner[];
}

export type AdminRole = 'super_admin' | 'admin' | 'staff';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: AdminRole;
  passwordHash?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  adminId?: string;
  adminName?: string;
  adminEmail?: string;
  action: string;
  category: 'product' | 'section' | 'order' | 'customer' | 'setting' | 'auth' | 'comment' | 'message';
  details: string;
  targetId?: string;
  createdAt: string;
  timestamp?: string;
}

export type AdminTab =
  | 'dashboard'
  | 'sections'
  | 'products'
  | 'product-form'
  | 'product_form'
  | 'orders'
  | 'customers'
  | 'comments'
  | 'messages'
  | 'media'
  | 'banners'
  | 'payments'
  | 'delivery'
  | 'settings'
  | 'appearance'
  | 'faqs'
  | 'policies'
  | 'admins'
  | 'roles'
  | 'backups'
  | 'logs';

export type ActiveView = 
  | 'home'
  | 'sections'
  | 'section-detail'
  | 'product-detail'
  | 'search'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'order-detail'
  | 'order-tracking'
  | 'wishlist'
  | 'account'
  | 'contact'
  | 'about'
  | 'delivery-info'
  | 'payment-info'
  | 'returns'
  | 'privacy'
  | 'terms'
  | 'faq'
  | 'admin'
  | 'admin-login'
  | 'admin-panel'
  | 'not-found';



