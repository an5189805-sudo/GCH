/**
 * Gondal Clothes House - Store Service & Scalable Storage Architecture
 * Handles client-side persistence with real schemas, ready for Admin Panel in Part 6
 */

import {
  User,
  Section,
  Product,
  Order,
  Comment,
  CustomerMessage,
  StoreConfig,
  UserAddress,
  SavedAddress,
  CustomerNotification,
  NotificationType,
  ProductQuestion,
  OrderStatus,
  PaymentTransaction,
  ProductMediaItem,
  AdminUser,
  ActivityLog,
  FAQItem,
  HeroBanner,
} from '../types';
import { ValidationService } from './validationService';
import { SearchService, SearchFilters } from './searchService';
import { OrderSecurityService } from './orderSecurityService';

const STORAGE_KEYS = {
  STORE_CONFIG: 'gondal_store_config_v1',
  SECTIONS: 'gondal_sections_v1',
  PRODUCTS: 'gondal_products_v1',
  ORDERS: 'gondal_orders_v1',
  TRANSACTIONS: 'gondal_transactions_v1',
  COMMENTS: 'gondal_comments_v1',
  MESSAGES: 'gondal_messages_v1',
  USERS: 'gondal_users_v1',
  CURRENT_USER: 'gondal_current_user_v1',
  CART: 'gondal_cart_v1',
  WISHLIST_GUEST: 'gondal_wishlist_guest_v1',
  WISHLIST_USER_PREFIX: 'gondal_wishlist_user_',
  SAVED_ADDRESSES: 'gondal_saved_addresses_v1',
  NOTIFICATIONS: 'gondal_notifications_v1',
  QUESTIONS: 'gondal_questions_v1',
  RECENTLY_VIEWED: 'gondal_recently_viewed_v1',
  ADMIN_USERS: 'gondal_admin_users_v1',
  CURRENT_ADMIN: 'gondal_current_admin_v1',
  ACTIVITY_LOGS: 'gondal_activity_logs_v1',
};

export const DEFAULT_FAQS = [
  {
    id: 'faq_1',
    question: 'How do I place an order on Gondal Clothes House?',
    answer: 'Select your desired clothing items, pick your preferred size and color, and click "Add to Cart" or "Buy Now". Proceed to Checkout, enter your delivery address across Pakistan, select Cash on Delivery (COD) or Online Bank Transfer, and click "Place Order Now".',
    category: 'Orders & Delivery' as const,
    sortOrder: 1,
  },
  {
    id: 'faq_2',
    question: 'What are the delivery charges and delivery times?',
    answer: 'We offer standard nationwide delivery across Pakistan for Rs. 250. Orders over Rs. 3,000 qualify for 100% Free Shipping. Most parcels are dispatched within 24 hours and delivered within 2-4 business days.',
    category: 'Orders & Delivery' as const,
    sortOrder: 2,
  },
  {
    id: 'faq_3',
    question: 'Can I pay via Cash on Delivery (COD)?',
    answer: 'Yes, Cash on Delivery is our most popular and recommended payment method across all major cities and towns in Pakistan. You only pay when your parcel is handed to you.',
    category: 'Payments' as const,
    sortOrder: 3,
  },
  {
    id: 'faq_4',
    question: 'What is the Return & Exchange policy?',
    answer: 'We offer a convenient 7-day exchange window for any size issues or defective items. The clothing must be in its original unworn condition with tags intact. Contact our boutique via WhatsApp or our Contact page to initiate an exchange.',
    category: 'Returns & Exchanges' as const,
    sortOrder: 4,
  },
  {
    id: 'faq_5',
    question: 'How do I know my correct clothing size?',
    answer: 'Every product page includes size options (Small, Medium, Large, XL, etc.) along with fit guidance. You can also message our stylists via our Contact page or WhatsApp for bespoke measurements advice.',
    category: 'Sizing & Fabric' as const,
    sortOrder: 5,
  },
  {
    id: 'faq_6',
    question: 'How can I track my placed order?',
    answer: 'Go to "Account" -> "My Orders" or "Track Order Status". Enter your order number (e.g. GCH-...) to see the live timeline from Pending -> Confirmed -> Processing -> Shipped -> Delivered.',
    category: 'Orders & Delivery' as const,
    sortOrder: 6,
  },
];

export const DEFAULT_STORE_CONFIG: StoreConfig = {
  storeName: 'Gondal Clothes House',
  tagline: 'Premier Clothing & Elegant Attire',
  logoText: 'GONDAL',
  logoSubtitle: 'CLOTHES HOUSE',
  phone: '+92 300 1234567',
  whatsappNumber: '+923001234567',
  email: 'info@gondalclotheshouse.com',
  address: 'Main Commercial Plaza, City Center, Gondal House',
  city: 'Gujrat',
  country: 'Pakistan',
  businessHours: 'Mon - Sat: 10:00 AM - 10:00 PM | Sun: 02:00 PM - 09:00 PM',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  deliveryFee: 250,
  freeDeliveryThreshold: 3000,
  allowOnlinePayment: true,
  announcementText: 'Welcome to Gondal Clothes House — Free Nationwide Delivery on Orders over Rs. 3,000',
  showAnnouncement: true,
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    whatsapp: 'https://wa.me/923001234567',
    tiktok: 'https://tiktok.com',
    youtube: 'https://youtube.com',
  },
  bankDetails: {
    bankName: 'Meezan Bank Ltd / Habib Bank Ltd',
    accountTitle: 'Gondal Clothes House',
    accountNumber: '0101-0102030405',
    iban: 'PK00MEZN0001010102030405',
    raastId: '03001234567',
    instructions: 'Please include your Order Number as the transfer reference and share receipt on WhatsApp.',
  },
  courierSettings: {
    defaultPartner: 'Trax / Leopard / TCS',
    trackingBaseUrl: 'https://track.courier.pk/',
    expressDeliveryAvailable: true,
    expressDeliveryFee: 450,
  },
  themeSettings: {
    primaryColor: '#1c1917',
    accentColor: '#d97706',
    fontFamily: 'Playfair Display / Plus Jakarta Sans',
    themeStyle: 'luxury',
  },
  aboutUsText: 'Gondal Clothes House has been serving customers with authentic fabrics, exquisite tailoring, and unmatched customer service. We pride ourselves on curating superior men, women, and kids garments that combine cultural heritage with modern contemporary design.',
  deliveryPolicyText: 'All orders are dispatched via trusted courier partners across Pakistan within 24 hours of order confirmation. Deliveries in major metropolitan areas take 2-3 business days, while regional towns take 3-5 business days. Free shipping applies to all orders exceeding Rs. 3,000.',
  paymentPolicyText: 'We accept Cash on Delivery (COD) across Pakistan. You can inspect your sealed package upon arrival and pay the delivery courier directly. Direct bank transfer and online payments are also supported.',
  returnPolicyText: 'Customer satisfaction is our highest priority. We accept exchange requests within 7 days of delivery for unwashed, unworn garments with original packaging and tags. Exchanges for sizing or defects are processed swiftly without hidden fees.',
  privacyPolicyText: 'We strictly protect the confidentiality of our customers. Your personal details, address, phone number, and order records are used solely to fulfill your shipments and communicate updates regarding your purchases.',
  termsConditionsText: 'By placing an order with Gondal Clothes House, you agree to receive order notifications via SMS, email, or phone. All prices are stated in PKR and include applicable local taxes. Product colors may slightly vary due to studio lighting and screen calibrations.',
  faqs: DEFAULT_FAQS,
  banners: [],
};

class StoreService {
  // Store Config
  getStoreConfig(): StoreConfig {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STORE_CONFIG);
      return saved ? { ...DEFAULT_STORE_CONFIG, ...JSON.parse(saved) } : DEFAULT_STORE_CONFIG;
    } catch {
      return DEFAULT_STORE_CONFIG;
    }
  }

  updateStoreConfig(config: Partial<StoreConfig>): StoreConfig {
    const current = this.getStoreConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(STORAGE_KEYS.STORE_CONFIG, JSON.stringify(updated));
    return updated;
  }

  saveStoreConfig(config: Partial<StoreConfig>): StoreConfig {
    return this.updateStoreConfig(config);
  }

  getSettings(): StoreConfig {
    return this.getStoreConfig();
  }

  saveSettings(config: Partial<StoreConfig>): StoreConfig {
    return this.updateStoreConfig(config);
  }

  // Sections (Starts 100% empty - No fake sections)
  getSections(): Section[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getPublishedSections(): Section[] {
    return this.getSections().filter(
      (s) => s.status === 'published' && s.visibility === 'public'
    );
  }

  saveSection(section: Omit<Section, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Section {
    const sections = this.getSections();
    const now = new Date().toISOString();
    let updatedSection: Section;

    const cleanName = ValidationService.sanitizeString(section.name);
    const slug = section.slug || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (section.id) {
      const index = sections.findIndex((s) => s.id === section.id);
      if (index >= 0) {
        updatedSection = {
          ...sections[index],
          ...section,
          name: cleanName,
          slug,
          updatedAt: now,
        };
        sections[index] = updatedSection;
      } else {
        updatedSection = {
          ...section,
          name: cleanName,
          slug,
          id: section.id,
          createdAt: now,
          updatedAt: now,
        } as Section;
        sections.push(updatedSection);
      }
    } else {
      updatedSection = {
        ...section,
        name: cleanName,
        slug,
        id: 'sec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: now,
        updatedAt: now,
      } as Section;
      sections.push(updatedSection);
    }

    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    return updatedSection;
  }

  deleteSection(sectionId: string): void {
    let sections = this.getSections();
    sections = sections.filter((s) => s.id !== sectionId);
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  }

  // Products (Starts 100% empty - No fake products)
  getProducts(): Product[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getActiveProducts(): Product[] {
    const publishedSectionIds = new Set(this.getPublishedSections().map((s) => s.id));
    const allSections = this.getSections();
    
    return this.getProducts().filter((p) => {
      if (p.status !== 'active') return false;
      // If sections exist and product is linked to a section, section must be published
      if (allSections.length > 0 && p.sectionId && !publishedSectionIds.has(p.sectionId)) {
        return false;
      }
      return true;
    });
  }

  getProductById(id: string): Product | undefined {
    return this.getProducts().find((p) => p.id === id);
  }

  getProductsBySection(sectionId: string): Product[] {
    return this.getActiveProducts().filter((p) => p.sectionId === sectionId);
  }

  searchProducts(query: string, filters?: SearchFilters): Product[] {
    const products = this.getProducts();
    const sections = this.getSections();
    return SearchService.searchProducts(products, sections, query, filters);
  }

  saveProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Product {
    const products = this.getProducts();
    const now = new Date().toISOString();
    let updatedProduct: Product;

    const title = ValidationService.sanitizeString(product.title);
    const sku = product.sku?.trim().toUpperCase() || `SKU-${Date.now().toString().slice(-6)}`;

    if (product.id) {
      const index = products.findIndex((p) => p.id === product.id);
      if (index >= 0) {
        updatedProduct = {
          ...products[index],
          ...product,
          title,
          sku,
          updatedAt: now,
        };
        products[index] = updatedProduct;
      } else {
        updatedProduct = {
          ...product,
          title,
          sku,
          id: product.id,
          createdAt: now,
          updatedAt: now,
        } as Product;
        products.push(updatedProduct);
      }
    } else {
      updatedProduct = {
        ...product,
        title,
        sku,
        id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        createdAt: now,
        updatedAt: now,
      } as Product;
      products.push(updatedProduct);
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    return updatedProduct;
  }

  deleteProduct(productId: string): void {
    let products = this.getProducts();
    products = products.filter((p) => p.id !== productId);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  // Comments / Reviews (Starts 100% empty)
  getComments(): Comment[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getApprovedCommentsForProduct(productId: string): Comment[] {
    return this.getComments().filter(
      (c) => c.productId === productId && (c.status === 'approved' || c.status === 'pending')
    );
  }

  addComment(commentData: {
    productId: string;
    customerId?: string;
    customerName: string;
    comment: string;
    rating: number;
    isVerifiedPurchase?: boolean;
  }): Comment {
    const comments = this.getComments();
    const newComment: Comment = {
      id: 'comm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      productId: commentData.productId,
      customerId: commentData.customerId,
      customerName: commentData.customerName.trim() || 'Anonymous Customer',
      comment: commentData.comment.trim(),
      rating: Math.min(5, Math.max(1, commentData.rating)),
      status: 'approved',
      isVerifiedPurchase: Boolean(commentData.isVerifiedPurchase),
      createdAt: new Date().toISOString(),
    };
    comments.unshift(newComment);
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

    // Also trigger notification for customer
    if (commentData.customerId) {
      const product = this.getProductById(commentData.productId);
      this.createNotification({
        customerId: commentData.customerId,
        title: 'Review Published',
        message: `Your review for "${product?.title || 'product'}" was submitted successfully.`,
        type: 'review',
        relatedId: commentData.productId,
      });
    }

    return newComment;
  }

  updateComment(commentId: string, comment: string, rating: number, customerId?: string): Comment {
    const comments = this.getComments();
    const index = comments.findIndex((c) => c.id === commentId && (!customerId || c.customerId === customerId));
    if (index === -1) {
      throw new Error('Review not found or unauthorized to edit');
    }
    const updated: Comment = {
      ...comments[index],
      comment: comment.trim(),
      rating: Math.min(5, Math.max(1, rating)),
    };
    comments[index] = updated;
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    return updated;
  }

  deleteComment(commentId: string, customerId?: string): void {
    let comments = this.getComments();
    comments = comments.filter((c) => !(c.id === commentId && (!customerId || c.customerId === customerId)));
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }

  // Product Questions
  getQuestions(): ProductQuestion[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getQuestionsForProduct(productId: string): ProductQuestion[] {
    return this.getQuestions().filter((q) => q.productId === productId);
  }

  addQuestion(productId: string, customerName: string, question: string, customerId?: string): ProductQuestion {
    const questions = this.getQuestions();
    const newQuestion: ProductQuestion = {
      id: 'ques_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      productId,
      customerId,
      customerName: customerName.trim() || 'Customer',
      question: question.trim(),
      createdAt: new Date().toISOString(),
    };
    questions.unshift(newQuestion);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return newQuestion;
  }

  // Customer Messages
  getMessages(): CustomerMessage[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getCustomerMessages(customerEmailOrId: string): CustomerMessage[] {
    const messages = this.getMessages();
    const lower = customerEmailOrId.toLowerCase();
    return messages.filter(
      (m) =>
        (m.customerId && m.customerId === customerEmailOrId) ||
        m.email.toLowerCase() === lower
    );
  }

  sendMessage(messageData: {
    customerId?: string;
    name: string;
    phone: string;
    email: string;
    subject?: string;
    orderNumber?: string;
    message: string;
  }): CustomerMessage {
    const messages = this.getMessages();
    const newMessage: CustomerMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      customerId: messageData.customerId,
      name: messageData.name.trim(),
      phone: messageData.phone.trim(),
      email: messageData.email.trim(),
      subject: messageData.subject?.trim(),
      orderNumber: messageData.orderNumber?.trim(),
      message: messageData.message.trim(),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    messages.unshift(newMessage);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

    if (messageData.customerId) {
      this.createNotification({
        customerId: messageData.customerId,
        title: 'Message Sent',
        message: `Your message regarding ${messageData.subject || messageData.orderNumber || 'your inquiry'} was sent to customer support.`,
        type: 'message',
        relatedId: newMessage.id,
      });
    }

    return newMessage;
  }

  // Orders (Starts 100% empty)
  getOrders(): Order[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getCustomerOrders(customerEmailOrId: string): Order[] {
    const orders = this.getOrders();
    const lower = customerEmailOrId.toLowerCase();
    return orders.filter(
      (o) =>
        (o.customerId && o.customerId === customerEmailOrId) ||
        o.customerEmail.toLowerCase() === lower ||
        o.shippingAddress.email.toLowerCase() === lower
    );
  }

  getOrderById(orderId: string): Order | undefined {
    return this.getOrders().find((o) => o.id === orderId || o.orderNumber === orderId);
  }

  hasPurchasedProduct(productId: string, customerEmailOrId: string): boolean {
    const orders = this.getCustomerOrders(customerEmailOrId);
    return orders.some(
      (order) =>
        order.status !== 'cancelled' &&
        order.items.some((item) => item.productId === productId)
    );
  }

  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
    const orders = this.getOrders();
    const count = orders.length + 1;
    const orderNumber = `GCH-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      orderNumber,
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: 'Order successfully placed by customer.',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Deduct stock safely from products
    const products = this.getProducts();
    orderData.items.forEach((item) => {
      const pIdx = products.findIndex((p) => p.id === item.productId);
      if (pIdx >= 0) {
        products[pIdx].stock = Math.max(0, products[pIdx].stock - item.quantity);
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Create real customer notification
    if (orderData.customerId) {
      this.createNotification({
        customerId: orderData.customerId,
        title: 'Order Placed Successfully',
        message: `Order #${orderNumber} for Rs. ${orderData.total.toLocaleString()} was placed. We will verify and dispatch soon.`,
        type: 'order',
        relatedId: newOrder.id,
      });
    }

    return newOrder;
  }

  cancelOrder(orderId: string, reason?: string, customerId?: string): Order {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) {
      throw new Error('Order not found');
    }
    const order = orders[index];

    // Check customer authorization if customerId provided
    if (customerId && order.customerId && order.customerId !== customerId) {
      throw new Error('Unauthorized to cancel this order.');
    }

    // Only pending or confirmed orders can be cancelled by customer
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      throw new Error(`Order cannot be cancelled because it is already ${order.status}.`);
    }

    const now = new Date().toISOString();
    const updatedHistory = [...(order.statusHistory || [])];
    updatedHistory.push({
      status: 'cancelled',
      timestamp: now,
      note: reason ? `Customer cancelled: ${reason}` : 'Cancelled by customer.',
    });

    const updatedOrder: Order = {
      ...order,
      status: 'cancelled',
      cancellationReason: reason || 'Customer requested cancellation.',
      statusHistory: updatedHistory,
      updatedAt: now,
    };

    orders[index] = updatedOrder;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Restock items
    const products = this.getProducts();
    order.items.forEach((item) => {
      const pIdx = products.findIndex((p) => p.id === item.productId);
      if (pIdx >= 0) {
        products[pIdx].stock += item.quantity;
      }
    });
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Create real notification
    if (order.customerId) {
      this.createNotification({
        customerId: order.customerId,
        title: 'Order Cancelled',
        message: `Order #${order.orderNumber} has been cancelled.`,
        type: 'order',
        relatedId: order.id,
      });
    }

    return updatedOrder;
  }

  // Wishlist / Favorites
  getWishlist(userId?: string): string[] {
    try {
      const key = userId ? `${STORAGE_KEYS.WISHLIST_USER_PREFIX}${userId}` : STORAGE_KEYS.WISHLIST_GUEST;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  isInWishlist(productId: string, userId?: string): boolean {
    const list = this.getWishlist(userId);
    return list.includes(productId);
  }

  toggleWishlist(productId: string, userId?: string): boolean {
    const key = userId ? `${STORAGE_KEYS.WISHLIST_USER_PREFIX}${userId}` : STORAGE_KEYS.WISHLIST_GUEST;
    let list = this.getWishlist(userId);
    const exists = list.includes(productId);
    if (exists) {
      list = list.filter((id) => id !== productId);
    } else {
      list.push(productId);
    }
    localStorage.setItem(key, JSON.stringify(list));
    return !exists;
  }

  removeFromWishlist(productId: string, userId?: string): void {
    const key = userId ? `${STORAGE_KEYS.WISHLIST_USER_PREFIX}${userId}` : STORAGE_KEYS.WISHLIST_GUEST;
    let list = this.getWishlist(userId);
    list = list.filter((id) => id !== productId);
    localStorage.setItem(key, JSON.stringify(list));
  }

  clearWishlist(userId?: string): void {
    const key = userId ? `${STORAGE_KEYS.WISHLIST_USER_PREFIX}${userId}` : STORAGE_KEYS.WISHLIST_GUEST;
    localStorage.removeItem(key);
  }

  syncGuestWishlistToUser(userId: string): void {
    const guestWishlist = this.getWishlist();
    if (guestWishlist.length === 0) return;
    const userWishlist = this.getWishlist(userId);
    const combined = Array.from(new Set([...userWishlist, ...guestWishlist]));
    localStorage.setItem(`${STORAGE_KEYS.WISHLIST_USER_PREFIX}${userId}`, JSON.stringify(combined));
    this.clearWishlist(); // clear guest
  }

  // Saved Addresses
  getSavedAddresses(userId?: string): SavedAddress[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ADDRESSES);
      const all: SavedAddress[] = saved ? JSON.parse(saved) : [];
      if (userId) {
        return all.filter((a) => a.userId === userId);
      }
      return all.filter((a) => !a.userId);
    } catch {
      return [];
    }
  }

  getDefaultAddress(userId?: string): SavedAddress | undefined {
    const list = this.getSavedAddresses(userId);
    return list.find((a) => a.isDefault) || list[0];
  }

  saveAddress(
    addressData: Omit<SavedAddress, 'id' | 'createdAt'> & { id?: string },
    userId?: string
  ): SavedAddress {
    let addresses: SavedAddress[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ADDRESSES);
      addresses = saved ? JSON.parse(saved) : [];
    } catch {
      addresses = [];
    }

    const now = new Date().toISOString();
    let updatedAddress: SavedAddress;

    // If making this address default, clear isDefault for other addresses of this user
    if (addressData.isDefault) {
      addresses = addresses.map((a) => {
        if (a.userId === userId) {
          return { ...a, isDefault: false };
        }
        return a;
      });
    }

    if (addressData.id) {
      const index = addresses.findIndex((a) => a.id === addressData.id);
      if (index >= 0) {
        updatedAddress = {
          ...addresses[index],
          ...addressData,
          userId: userId || addresses[index].userId,
        };
        addresses[index] = updatedAddress;
      } else {
        updatedAddress = {
          ...addressData,
          id: addressData.id,
          userId,
          createdAt: now,
        } as SavedAddress;
        addresses.push(updatedAddress);
      }
    } else {
      const isFirst = addresses.filter((a) => a.userId === userId).length === 0;
      updatedAddress = {
        ...addressData,
        id: 'addr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId,
        isDefault: addressData.isDefault !== undefined ? addressData.isDefault : isFirst,
        createdAt: now,
      } as SavedAddress;
      addresses.push(updatedAddress);
    }

    localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(addresses));
    return updatedAddress;
  }

  deleteAddress(addressId: string, userId?: string): void {
    let addresses: SavedAddress[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ADDRESSES);
      addresses = saved ? JSON.parse(saved) : [];
    } catch {
      addresses = [];
    }

    addresses = addresses.filter((a) => !(a.id === addressId && (!userId || a.userId === userId)));
    localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(addresses));
  }

  setDefaultAddress(addressId: string, userId?: string): void {
    let addresses: SavedAddress[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ADDRESSES);
      addresses = saved ? JSON.parse(saved) : [];
    } catch {
      addresses = [];
    }

    addresses = addresses.map((a) => {
      if (a.userId === userId) {
        return { ...a, isDefault: a.id === addressId };
      }
      return a;
    });

    localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(addresses));
  }

  // Notifications
  getNotifications(customerId?: string): CustomerNotification[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      const all: CustomerNotification[] = saved ? JSON.parse(saved) : [];
      if (customerId) {
        return all.filter((n) => !n.customerId || n.customerId === customerId);
      }
      return all.filter((n) => !n.customerId);
    } catch {
      return [];
    }
  }

  getUnreadNotificationCount(customerId?: string): number {
    return this.getNotifications(customerId).filter((n) => !n.isRead).length;
  }

  createNotification(data: Omit<CustomerNotification, 'id' | 'createdAt' | 'isRead'>): CustomerNotification {
    let notifications: CustomerNotification[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      notifications = saved ? JSON.parse(saved) : [];
    } catch {
      notifications = [];
    }

    const newNotif: CustomerNotification = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return newNotif;
  }

  sendNotification(
    customerId: string,
    title: string,
    message: string,
    type: NotificationType = 'system',
    relatedId?: string
  ): CustomerNotification {
    return this.createNotification({
      customerId,
      title,
      message,
      type,
      relatedId,
    });
  }

  markNotificationAsRead(id: string): void {
    let notifications: CustomerNotification[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      notifications = saved ? JSON.parse(saved) : [];
    } catch {
      notifications = [];
    }

    notifications = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  markAllNotificationsAsRead(customerId?: string): void {
    let notifications: CustomerNotification[] = [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      notifications = saved ? JSON.parse(saved) : [];
    } catch {
      notifications = [];
    }

    notifications = notifications.map((n) => {
      if (!customerId || !n.customerId || n.customerId === customerId) {
        return { ...n, isRead: true };
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  // User Accounts
  getUsers(): User[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  getCurrentUser(): User | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }

  registerUser(name: string, email: string, phone: string, passwordHash?: string): User {
    const users = this.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }
    const now = new Date().toISOString();
    const newUser: User = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: 'customer',
      createdAt: now,
      updatedAt: now,
      passwordHash: passwordHash || 'hashed_secret',
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    this.syncGuestWishlistToUser(newUser.id);
    return newUser;
  }

  loginUser(email: string): User {
    const users = this.getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('Account not found. Please register first.');
    }
    this.setCurrentUser(found);
    this.syncGuestWishlistToUser(found.id);
    return found;
  }

  updateUserProfile(userId: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }
    const updated: User = {
      ...users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    users[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(updated);
    }
    return updated;
  }

  updateUserAddress(userId: string, address: UserAddress): User {
    return this.updateUserProfile(userId, { address });
  }

  // Cart Persistence
  getSavedCart(): any[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  saveCart(items: any[]): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  }

  // Recently Viewed Products
  getRecentlyViewedProductIds(): string[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_VIEWED);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  addRecentlyViewedProductId(productId: string): string[] {
    if (!productId) return this.getRecentlyViewedProductIds();
    try {
      const current = this.getRecentlyViewedProductIds();
      const filtered = current.filter((id) => id !== productId);
      filtered.unshift(productId); // add to beginning
      const trimmed = filtered.slice(0, 12); // keep top 12
      localStorage.setItem(STORAGE_KEYS.RECENTLY_VIEWED, JSON.stringify(trimmed));
      return trimmed;
    } catch {
      return [];
    }
  }

  // Banners & Promotional Media
  getBanners() {
    const config = this.getStoreConfig();
    return config.banners || [];
  }

  getActiveBanners() {
    return this.getBanners().filter((b) => b.isActive);
  }

  // FAQs
  getFAQs() {
    const config = this.getStoreConfig();
    return config.faqs || DEFAULT_FAQS;
  }

  // Payment Transactions
  getTransactions(): PaymentTransaction[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  recordTransaction(tx: Omit<PaymentTransaction, 'id' | 'createdAt'>): PaymentTransaction {
    const transactions = this.getTransactions();
    const newTx: PaymentTransaction = {
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...tx,
      createdAt: new Date().toISOString(),
    };
    transactions.unshift(newTx);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    return newTx;
  }

  getDatabaseStats() {
    return {
      sectionsCount: this.getSections().length,
      publishedSectionsCount: this.getPublishedSections().length,
      productsCount: this.getProducts().length,
      activeProductsCount: this.getActiveProducts().length,
      ordersCount: this.getOrders().length,
      pendingOrdersCount: this.getOrders().filter((o) => o.status === 'pending').length,
      usersCount: this.getUsers().length,
      commentsCount: this.getComments().length,
      pendingCommentsCount: this.getComments().filter((c) => c.status === 'pending').length,
      unreadMessagesCount: this.getMessages().filter((m) => m.status === 'unread').length,
      questionsCount: this.getQuestions().length,
      totalRevenue: this.getOrders()
        .filter((o) => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0),
    };
  }

  // Activity / Audit Logs
  getActivityLogs(): ActivityLog[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  logActivity(
    action: string,
    category: ActivityLog['category'],
    details: string,
    targetId?: string
  ): ActivityLog {
    const logs = this.getActivityLogs();
    const currentAdmin = this.getCurrentAdmin();
    const newLog: ActivityLog = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      adminId: currentAdmin?.id,
      adminName: currentAdmin?.name || 'Administrator',
      action,
      category,
      details,
      targetId,
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    // Keep max 500 audit logs
    if (logs.length > 500) logs.pop();
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs));
    return newLog;
  }

  clearActivityLogs(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVITY_LOGS);
  }

  // Admin Account & Auth Management
  getAdminUsers(): AdminUser[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }

    // Default bootstrap admin accounts including Owner Super Admin
    const ownerSuperAdmin: AdminUser = {
      id: 'adm_owner_super',
      username: 'an5189805',
      name: 'Owner / Super Admin',
      email: 'an5189805@gmail.com',
      role: 'super_admin',
      passwordHash: 'eight nine',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const defaultSuperAdmin: AdminUser = {
      id: 'adm_super_01',
      username: 'admin',
      name: 'Boutique Administrator',
      email: 'admin@gondalclothes.com',
      role: 'super_admin',
      passwordHash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', // SHA-256 for 'admin'
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const initialAdmins = [ownerSuperAdmin, defaultSuperAdmin];
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(initialAdmins));
    return initialAdmins;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    // Return predictable hex-like representation
    return Math.abs(hash).toString(16) + 'gondal_secure_' + str.length;
  }

  saveAdminUser(user: Partial<AdminUser> & { username: string; email: string; name: string }): AdminUser {
    const admins = this.getAdminUsers();
    const now = new Date().toISOString();
    let saved: AdminUser;

    if (user.id) {
      const index = admins.findIndex((a) => a.id === user.id);
      if (index >= 0) {
        saved = {
          ...admins[index],
          ...user,
          updatedAt: now,
        };
        admins[index] = saved;
      } else {
        saved = {
          ...user,
          id: user.id,
          role: user.role || 'admin',
          isActive: user.isActive ?? true,
          createdAt: now,
          updatedAt: now,
        } as AdminUser;
        admins.push(saved);
      }
    } else {
      saved = {
        ...user,
        id: 'adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        role: user.role || 'admin',
        isActive: user.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      } as AdminUser;
      admins.push(saved);
    }

    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(admins));
    this.logActivity('Saved Admin User', 'auth', `Saved admin profile: ${saved.username} (${saved.role})`, saved.id);
    return saved;
  }

  deleteAdminUser(adminId: string): { success: boolean; error?: string } {
    const admins = this.getAdminUsers();
    const target = admins.find((a) => a.id === adminId);
    if (!target) return { success: false, error: 'Admin user not found.' };

    if (target.role === 'super_admin') {
      const superAdmins = admins.filter((a) => a.role === 'super_admin');
      if (superAdmins.length <= 1) {
        return { success: false, error: 'Cannot delete the only Super Administrator account.' };
      }
    }

    const filtered = admins.filter((a) => a.id !== adminId);
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(filtered));
    this.logActivity('Deleted Admin User', 'auth', `Deleted admin: ${target.username}`, adminId);
    return { success: true };
  }

  adminLogin(identifier: string, passwordPlain: string): { success: boolean; admin?: AdminUser; error?: string } {
    const admins = this.getAdminUsers();
    const cleanId = identifier.trim().toLowerCase();

    const admin = admins.find(
      (a) =>
        a.username.toLowerCase() === cleanId ||
        a.email.toLowerCase() === cleanId
    );

    if (!admin) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    if (!admin.isActive) {
      return { success: false, error: 'This admin account has been deactivated. Contact Super Admin.' };
    }

    // Support default bootstrap credentials (username: 'admin', password: 'admin' or 'admin123', or owner 'eight nine')
    const normalizedInputPass = passwordPlain.trim().toLowerCase().replace(/\s+/g, ' ');
    const normalizedStoredPass = (admin.passwordHash || '').trim().toLowerCase().replace(/\s+/g, ' ');

    const isOwnerAccount = admin.email.toLowerCase() === 'an5189805@gmail.com' || admin.username.toLowerCase() === 'an5189805';
    const matchesOwnerPass =
      isOwnerAccount &&
      (normalizedInputPass === 'eight nine' ||
        normalizedInputPass === 'eightnine' ||
        normalizedInputPass === '89' ||
        normalizedInputPass === '8 9' ||
        normalizedInputPass === 'eight_nine');

    const matchesDefaultPass =
      matchesOwnerPass ||
      (admin.username === 'admin' && (passwordPlain === 'admin' || passwordPlain === 'admin123')) ||
      normalizedStoredPass === normalizedInputPass ||
      admin.passwordHash === this.simpleHash(passwordPlain) ||
      admin.passwordHash === passwordPlain;

    if (!matchesDefaultPass && admin.passwordHash) {
      return { success: false, error: 'Invalid username/email or password.' };
    }

    // Update last login
    admin.lastLoginAt = new Date().toISOString();
    this.saveAdminUser(admin);

    // Set session
    localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
    this.logActivity('Admin Login', 'auth', `Admin logged in: ${admin.username}`, admin.id);

    return { success: true, admin };
  }

  getCurrentAdmin(): AdminUser | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  logoutAdmin(): void {
    const admin = this.getCurrentAdmin();
    if (admin) {
      this.logActivity('Admin Logout', 'auth', `Admin logged out: ${admin.username}`, admin.id);
    }
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  }

  updateAdminPassword(adminId: string, newPasswordPlain: string): { success: boolean; error?: string } {
    if (!newPasswordPlain || newPasswordPlain.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters.' };
    }

    const admins = this.getAdminUsers();
    const index = admins.findIndex((a) => a.id === adminId);
    if (index === -1) return { success: false, error: 'Admin account not found.' };

    admins[index].passwordHash = this.simpleHash(newPasswordPlain);
    admins[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(admins));

    // Update current session if matching
    const current = this.getCurrentAdmin();
    if (current && current.id === adminId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admins[index]));
    }

    this.logActivity('Updated Password', 'auth', `Updated password for admin: ${admins[index].username}`, adminId);
    return { success: true };
  }

  // Admin Order Actions
  updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    note?: string,
    courierName?: string,
    trackingNumber?: string
  ): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index === -1) return null;

    const order = orders[index];
    const now = new Date().toISOString();
    const admin = this.getCurrentAdmin();

    order.status = newStatus;
    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    order.updatedAt = now;

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: newStatus,
      timestamp: now,
      note: note || `Order status updated to ${newStatus.toUpperCase()} by ${admin?.name || 'Administrator'}.`,
      updatedBy: admin?.name || 'Admin',
    });

    // Update payment status if marked delivered / paid
    if (newStatus === 'delivered' && order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
    }

    orders[index] = order;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Notify customer if account is linked
    if (order.customerId) {
      this.sendNotification(
        order.customerId,
        `Order ${order.orderNumber} is now ${newStatus.toUpperCase()}`,
        `Your order has been updated to "${newStatus}". ${trackingNumber ? `Tracking: ${trackingNumber} (${courierName})` : ''}`,
        'order',
        order.id
      );
    }

    this.logActivity(
      'Updated Order Status',
      'order',
      `Order ${order.orderNumber} status changed to ${newStatus}`,
      order.id
    );

    return order;
  }

  updateOrderPaymentStatus(orderId: string, paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    orders[index].paymentStatus = paymentStatus;
    orders[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    this.logActivity('Updated Payment Status', 'order', `Order ${orders[index].orderNumber} marked as ${paymentStatus}`, orderId);
    return orders[index];
  }

  deleteOrder(orderId: string): void {
    let orders = this.getOrders();
    const target = orders.find((o) => o.id === orderId);
    orders = orders.filter((o) => o.id !== orderId);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    if (target) {
      this.logActivity('Deleted Order', 'order', `Deleted order: ${target.orderNumber}`, orderId);
    }
  }

  // Admin Product Actions
  toggleProductStatus(productId: string): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    const currentStatus = products[index].status;
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    products[index].status = newStatus;
    products[index].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logActivity('Toggled Product Status', 'product', `Changed "${products[index].title}" to ${newStatus}`, productId);
    return products[index];
  }

  duplicateProduct(productId: string): Product | null {
    const product = this.getProductById(productId);
    if (!product) return null;

    const now = new Date().toISOString();
    const duplicate: Product = {
      ...product,
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: `${product.title} (Copy)`,
      sku: `${product.sku}-COPY-${Math.floor(100 + Math.random() * 900)}`,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
    };

    const products = this.getProducts();
    products.push(duplicate);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    this.logActivity('Duplicated Product', 'product', `Duplicated "${product.title}" into draft`, duplicate.id);
    return duplicate;
  }

  updateProductStock(productId: string, newStock: number): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    products[index].stock = Math.max(0, newStock);
    products[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logActivity('Updated Stock', 'product', `Set stock for "${products[index].title}" to ${newStock}`, productId);
    return products[index];
  }

  updateProductPrice(productId: string, price: number, discount = 0): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === productId);
    if (index === -1) return null;

    products[index].price = price;
    products[index].discount = discount;
    products[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logActivity('Updated Price', 'product', `Updated price for "${products[index].title}" to Rs. ${price} (${discount}% off)`, productId);
    return products[index];
  }

  // Admin Section Actions
  toggleSectionStatus(sectionId: string): Section | null {
    const sections = this.getSections();
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return null;

    const newStatus = sections[index].status === 'published' ? 'draft' : 'published';
    sections[index].status = newStatus;
    sections[index].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    this.logActivity('Toggled Section Status', 'section', `Changed section "${sections[index].name}" to ${newStatus}`, sectionId);
    return sections[index];
  }

  toggleSectionVisibility(sectionId: string): Section | null {
    const sections = this.getSections();
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return null;

    const newVis = sections[index].visibility === 'public' ? 'hidden' : 'public';
    sections[index].visibility = newVis;
    sections[index].updatedAt = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
    this.logActivity('Toggled Section Visibility', 'section', `Changed section "${sections[index].name}" to ${newVis}`, sectionId);
    return sections[index];
  }

  reorderSections(orderedIds: string[]): void {
    const sections = this.getSections();
    const reordered = sections.map((s) => {
      const idx = orderedIds.indexOf(s.id);
      return idx >= 0 ? { ...s, sortOrder: idx } : s;
    });
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(reordered));
  }

  // Admin Comment Moderation
  updateCommentStatus(commentId: string, status: 'approved' | 'rejected' | 'pending'): Comment | null {
    const comments = this.getComments();
    const index = comments.findIndex((c) => c.id === commentId);
    if (index === -1) return null;

    comments[index].status = status;
    comments[index].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    this.logActivity('Moderated Review', 'comment', `Marked review from "${comments[index].customerName}" as ${status}`, commentId);
    return comments[index];
  }

  // Admin Inquiries / Messages
  replyToCustomerMessage(messageId: string, replyText: string): CustomerMessage | null {
    const messages = this.getMessages();
    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) return null;

    const now = new Date().toISOString();
    messages[index].reply = replyText.trim();
    messages[index].replyDate = now;
    messages[index].status = 'replied';

    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

    // Send customer notification if account exists
    if (messages[index].customerId) {
      this.sendNotification(
        messages[index].customerId!,
        'Response to Your Boutique Inquiry',
        `Gondal Clothes House support replied: "${replyText.substring(0, 80)}..."`,
        'message',
        messageId
      );
    }

    this.logActivity('Replied to Message', 'message', `Sent reply to customer message from ${messages[index].name}`, messageId);
    return messages[index];
  }

  updateMessageStatus(messageId: string, status: 'unread' | 'read' | 'replied' | 'closed'): CustomerMessage | null {
    const messages = this.getMessages();
    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) return null;

    messages[index].status = status;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    return messages[index];
  }

  deleteMessage(messageId: string): void {
    let messages = this.getMessages();
    messages = messages.filter((m) => m.id !== messageId);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }

  answerQuestion(questionId: string, answer: string): ProductQuestion | null {
    const questions = this.getQuestions();
    const index = questions.findIndex((q) => q.id === questionId);
    if (index === -1) return null;

    questions[index].answer = answer.trim();
    questions[index].answeredAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    return questions[index];
  }

  // Hero Banners Management
  saveBanner(banner: Omit<HeroBanner, 'id'> & { id?: string }): HeroBanner {
    const config = this.getStoreConfig();
    const banners = config.banners || [];
    let savedBanner: HeroBanner;

    if (banner.id) {
      const idx = banners.findIndex((b) => b.id === banner.id);
      if (idx >= 0) {
        savedBanner = { ...banners[idx], ...banner, id: banner.id };
        banners[idx] = savedBanner;
      } else {
        savedBanner = { ...banner, id: banner.id } as HeroBanner;
        banners.push(savedBanner);
      }
    } else {
      savedBanner = {
        ...banner,
        id: 'ban_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      };
      banners.push(savedBanner);
    }

    this.saveStoreConfig({ ...config, banners });
    this.logActivity('Saved Hero Banner', 'setting', `Saved banner: "${savedBanner.title}"`, savedBanner.id);
    return savedBanner;
  }

  deleteBanner(bannerId: string): void {
    const config = this.getStoreConfig();
    const banners = (config.banners || []).filter((b) => b.id !== bannerId);
    this.saveStoreConfig({ ...config, banners });
    this.logActivity('Deleted Hero Banner', 'setting', `Deleted banner ${bannerId}`, bannerId);
  }

  toggleBannerStatus(bannerId: string): void {
    const config = this.getStoreConfig();
    const banners = (config.banners || []).map((b) =>
      b.id === bannerId ? { ...b, isActive: !b.isActive } : b
    );
    this.saveStoreConfig({ ...config, banners });
  }

  // FAQ Management
  saveFAQ(faq: Omit<FAQItem, 'id'> & { id?: string }): FAQItem {
    const config = this.getStoreConfig();
    const faqs = config.faqs || DEFAULT_FAQS;
    let savedFAQ: FAQItem;

    if (faq.id) {
      const idx = faqs.findIndex((f) => f.id === faq.id);
      if (idx >= 0) {
        savedFAQ = { ...faqs[idx], ...faq, id: faq.id };
        faqs[idx] = savedFAQ;
      } else {
        savedFAQ = { ...faq, id: faq.id } as FAQItem;
        faqs.push(savedFAQ);
      }
    } else {
      savedFAQ = {
        ...faq,
        id: 'faq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      };
      faqs.push(savedFAQ);
    }

    this.saveStoreConfig({ ...config, faqs });
    this.logActivity('Saved FAQ', 'setting', `Saved FAQ: "${savedFAQ.question.substring(0, 40)}..."`, savedFAQ.id);
    return savedFAQ;
  }

  deleteFAQ(faqId: string): void {
    const config = this.getStoreConfig();
    const faqs = (config.faqs || DEFAULT_FAQS).filter((f) => f.id !== faqId);
    this.saveStoreConfig({ ...config, faqs });
    this.logActivity('Deleted FAQ', 'setting', `Deleted FAQ ${faqId}`, faqId);
  }

  // Database Export / Snapshot
  exportDatabaseSnapshot(): string {
    const data = {
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      storeName: this.getStoreConfig().storeName,
      storeConfig: this.getStoreConfig(),
      sections: this.getSections(),
      products: this.getProducts(),
      orders: this.getOrders(),
      transactions: this.getTransactions(),
      comments: this.getComments(),
      messages: this.getMessages(),
      questions: this.getQuestions(),
      users: this.getUsers(),
      savedAddresses: this.getSavedAddresses(),
      notifications: this.getNotifications(),
      adminUsers: this.getAdminUsers().map((a) => ({
        id: a.id,
        username: a.username,
        name: a.name,
        email: a.email,
        role: a.role,
        isActive: a.isActive,
        createdAt: a.createdAt,
        lastLoginAt: a.lastLoginAt,
      })),
      activityLogs: this.getActivityLogs().slice(0, 100),
    };
    return JSON.stringify(data, null, 2);
  }

  // Database Import / Restore
  importDatabaseSnapshot(jsonString: string): { success: boolean; error?: string } {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') {
        return { success: false, error: 'Invalid snapshot format.' };
      }

      if (data.storeConfig) localStorage.setItem(STORAGE_KEYS.STORE_CONFIG, JSON.stringify(data.storeConfig));
      if (Array.isArray(data.sections)) localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(data.sections));
      if (Array.isArray(data.products)) localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products));
      if (Array.isArray(data.orders)) localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
      if (Array.isArray(data.transactions)) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
      if (Array.isArray(data.comments)) localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(data.comments));
      if (Array.isArray(data.messages)) localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(data.messages));
      if (Array.isArray(data.questions)) localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(data.questions));
      if (Array.isArray(data.users)) localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
      if (Array.isArray(data.savedAddresses)) localStorage.setItem(STORAGE_KEYS.SAVED_ADDRESSES, JSON.stringify(data.savedAddresses));
      if (Array.isArray(data.notifications)) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data.notifications));

      this.logActivity('Imported Database', 'setting', 'Restored store state from database snapshot');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to parse JSON snapshot.' };
    }
  }

  // Clean Database Reset (Preserves master super admin)
  resetDatabaseToCleanState(): void {
    const admin = this.getCurrentAdmin();
    // Clear all business data
    localStorage.removeItem(STORAGE_KEYS.SECTIONS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.COMMENTS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    
    this.logActivity(
      'Database Reset',
      'setting',
      `Store database was reset to fresh blank state by ${admin?.name || 'Super Admin'}`
    );
  }

  // RBAC Permission Checks
  isSuperAdmin(adminUser?: AdminUser | null): boolean {
    const target = adminUser !== undefined ? adminUser : this.getCurrentAdmin();
    return Boolean(target && target.role === 'super_admin' && target.isActive);
  }

  isAdmin(adminUser?: AdminUser | null): boolean {
    const target = adminUser !== undefined ? adminUser : this.getCurrentAdmin();
    return Boolean(target && (target.role === 'super_admin' || target.role === 'admin') && target.isActive);
  }
}

export const storeService = new StoreService();

