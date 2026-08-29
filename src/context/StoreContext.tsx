/**
 * Gondal Clothes House - Store Context & Global State
 * Advanced Customer Experience, Wishlist, Notifications, Orders & Addresses
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  StoreConfig,
  Section,
  Product,
  CartItem,
  User,
  Order,
  UserAddress,
  SavedAddress,
  CustomerNotification,
  PaymentMethod,
  ActiveView,
  AdminUser,
  AdminTab,
} from '../types';
import { storeService } from '../services/storeService';

interface StoreContextType {
  storeConfig: StoreConfig;
  sections: Section[];
  publishedSections: Section[];
  products: Product[];
  activeProducts: Product[];
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  
  // Wishlist
  wishlistProductIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveWishlistToCart: (product: Product, size?: string, color?: string) => void;

  // Notifications
  notifications: CustomerNotification[];
  unreadNotificationCount: number;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Addresses
  savedAddresses: SavedAddress[];
  defaultAddress: SavedAddress | undefined;
  saveAddress: (address: Omit<SavedAddress, 'id' | 'createdAt'> & { id?: string }) => SavedAddress;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;

  // Current User & Active View
  currentUser: User | null;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  contactPrefillOrderNumber: string | null;
  setContactPrefillOrderNumber: (orderNumber: string | null) => void;
  recentlyViewedProducts: Product[];
  
  // Cart Actions
  addToCart: (product: Product, selectedSize: string, selectedColor: string, quantity?: number) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  buyNow: (product: Product, selectedSize: string, selectedColor: string, quantity?: number) => void;

  // Navigation Helpers
  openProduct: (productId: string) => void;
  openSection: (sectionId: string) => void;
  openOrder: (orderId: string) => void;
  openOrderTracking: (orderId: string) => void;
  goToHome: () => void;
  goToCheckout: () => void;
  goToCart: () => void;
  goToWishlist: () => void;
  goToAccount: () => void;
  goToContact: (prefillOrderNumber?: string) => void;
  goToAbout: () => void;
  goToDeliveryInfo: () => void;
  goToPaymentInfo: () => void;
  goToReturns: () => void;
  goToPrivacy: () => void;
  goToTerms: () => void;
  goToFAQ: () => void;
  goToNotFound: () => void;
  goToAdminLogin: () => void;
  goToAdminPanel: (tab?: AdminTab) => void;

  // Admin State & Control
  currentAdmin: AdminUser | null;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  adminEditingProductId: string | null;
  setAdminEditingProductId: (id: string | null) => void;
  adminEditingSectionId: string | null;
  setAdminEditingSectionId: (id: string | null) => void;
  adminEditingOrderId: string | null;
  setAdminEditingOrderId: (id: string | null) => void;
  startCreatingProduct: () => void;
  startEditingProduct: (id: string) => void;
  cancelEditingProduct: () => void;
  adminLogin: (identifier: string, passwordPlain: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;

  // Auth & Account Actions
  register: (name: string, email: string, phone: string, password?: string) => Promise<User>;
  login: (email: string) => Promise<User>;
  logout: () => void;
  updateContactInfo: (address: UserAddress) => User;

  // Order & Store Operations
  placeOrder: (shippingAddress: UserAddress, paymentMethod: PaymentMethod) => Promise<Order>;
  cancelOrder: (orderId: string, reason?: string) => Promise<Order>;
  hasPurchasedProduct: (productId: string) => boolean;
  submitReview: (productId: string, comment: string, rating: number, customerName?: string) => Promise<void>;
  updateReview: (commentId: string, comment: string, rating: number) => Promise<void>;
  deleteReview: (commentId: string) => Promise<void>;
  submitQuestion: (productId: string, question: string, customerName?: string) => Promise<void>;
  sendContactMessage: (name: string, phone: string, email: string, message: string, subject?: string, orderNumber?: string) => Promise<void>;
  
  // Notification Toast & Refresh
  toastMessage: string | null;
  showToast: (msg: string) => void;
  refreshData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => storeService.getStoreConfig());
  const [sections, setSections] = useState<Section[]>(() => storeService.getSections());
  const [products, setProducts] = useState<Product[]>(() => storeService.getProducts());
  const [cart, setCart] = useState<CartItem[]>(() => storeService.getSavedCart());
  const [currentUser, setCurrentUser] = useState<User | null>(() => storeService.getCurrentUser());
  
  // Wishlist state
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(() =>
    storeService.getWishlist(currentUser?.id)
  );

  // Addresses state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(() =>
    storeService.getSavedAddresses(currentUser?.id)
  );

  // Notifications state
  const [notifications, setNotifications] = useState<CustomerNotification[]>(() =>
    storeService.getNotifications(currentUser?.id)
  );
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() =>
    storeService.getRecentlyViewedProductIds()
  );

  // View state
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [contactPrefillOrderNumber, setContactPrefillOrderNumber] = useState<string | null>(null);

  // Admin state
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => storeService.getCurrentAdmin());
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [adminEditingProductId, setAdminEditingProductId] = useState<string | null>(null);
  const [adminEditingSectionId, setAdminEditingSectionId] = useState<string | null>(null);
  const [adminEditingOrderId, setAdminEditingOrderId] = useState<string | null>(null);
  
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(typeof query === 'string' ? query : '');
  }, []);
  
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recentlyViewedProducts = useMemo(() => {
    return recentlyViewedIds
      .map((id) => products.find((p) => p.id === id && p.status === 'active'))
      .filter((p): p is Product => Boolean(p));
  }, [recentlyViewedIds, products]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  const refreshData = useCallback(() => {
    setStoreConfig(storeService.getStoreConfig());
    setSections(storeService.getSections());
    setProducts(storeService.getProducts());
    const user = storeService.getCurrentUser();
    setCurrentUser(user);
    setWishlistProductIds(storeService.getWishlist(user?.id));
    setSavedAddresses(storeService.getSavedAddresses(user?.id));
    setNotifications(storeService.getNotifications(user?.id));
  }, []);

  // Sync wishlist, addresses & notifications when user changes
  useEffect(() => {
    setWishlistProductIds(storeService.getWishlist(currentUser?.id));
    setSavedAddresses(storeService.getSavedAddresses(currentUser?.id));
    setNotifications(storeService.getNotifications(currentUser?.id));
  }, [currentUser?.id]);

  useEffect(() => {
    storeService.saveCart(cart);
  }, [cart]);

  // Derived Values
  const publishedSections = useMemo(() => {
    return sections.filter((s) => s.status === 'published' && s.visibility === 'public');
  }, [sections]);

  const activeProducts = useMemo(() => {
    return products.filter((p) => p.status === 'active');
  }, [products]);

  const wishlistProducts = useMemo(() => {
    return activeProducts.filter((p) => wishlistProductIds.includes(p.id));
  }, [activeProducts, wishlistProductIds]);

  const wishlistCount = wishlistProductIds.length;

  const defaultAddress = useMemo(() => {
    return savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
  }, [savedAddresses]);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const cartDiscount = useMemo(() => {
    return cart.reduce((total, item) => {
      if (item.product.originalPrice && item.product.originalPrice > item.unitPrice) {
        const itemDiscount = (item.product.originalPrice - item.unitPrice) * item.quantity;
        return total + itemDiscount;
      }
      return total;
    }, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (cartSubtotal >= storeConfig.freeDeliveryThreshold) return 0;
    return storeConfig.deliveryFee;
  }, [cart.length, cartSubtotal, storeConfig.deliveryFee, storeConfig.freeDeliveryThreshold]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + deliveryFee;
  }, [cartSubtotal, deliveryFee]);

  // Wishlist Actions
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistProductIds.includes(productId);
    },
    [wishlistProductIds]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      const added = storeService.toggleWishlist(productId, currentUser?.id);
      setWishlistProductIds(storeService.getWishlist(currentUser?.id));
      const prod = products.find((p) => p.id === productId);
      if (added) {
        showToast(`Saved "${prod?.title || 'Item'}" to your wishlist.`);
      } else {
        showToast(`Removed from your wishlist.`);
      }
    },
    [currentUser?.id, products, showToast]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      storeService.removeFromWishlist(productId, currentUser?.id);
      setWishlistProductIds(storeService.getWishlist(currentUser?.id));
      showToast('Removed from wishlist.');
    },
    [currentUser?.id, showToast]
  );

  const clearWishlist = useCallback(() => {
    storeService.clearWishlist(currentUser?.id);
    setWishlistProductIds([]);
    showToast('Wishlist cleared.');
  }, [currentUser?.id, showToast]);

  // Address Actions
  const saveAddress = useCallback(
    (addressData: Omit<SavedAddress, 'id' | 'createdAt'> & { id?: string }) => {
      const saved = storeService.saveAddress(addressData, currentUser?.id);
      setSavedAddresses(storeService.getSavedAddresses(currentUser?.id));
      showToast('Delivery address saved successfully.');
      return saved;
    },
    [currentUser?.id, showToast]
  );

  const deleteAddress = useCallback(
    (addressId: string) => {
      storeService.deleteAddress(addressId, currentUser?.id);
      setSavedAddresses(storeService.getSavedAddresses(currentUser?.id));
      showToast('Address removed.');
    },
    [currentUser?.id, showToast]
  );

  const setDefaultAddress = useCallback(
    (addressId: string) => {
      storeService.setDefaultAddress(addressId, currentUser?.id);
      setSavedAddresses(storeService.getSavedAddresses(currentUser?.id));
      showToast('Default delivery address updated.');
    },
    [currentUser?.id, showToast]
  );

  // Notification Actions
  const markNotificationAsRead = useCallback(
    (id: string) => {
      storeService.markNotificationAsRead(id);
      setNotifications(storeService.getNotifications(currentUser?.id));
    },
    [currentUser?.id]
  );

  const markAllNotificationsAsRead = useCallback(() => {
    storeService.markAllNotificationsAsRead(currentUser?.id);
    setNotifications(storeService.getNotifications(currentUser?.id));
    showToast('All notifications marked as read.');
  }, [currentUser?.id, showToast]);

  // Cart Handlers with Inventory Stock Validation
  const addToCart = useCallback(
    (product: Product, selectedSize: string, selectedColor: string, quantity = 1): boolean => {
      // Stock validation
      if (product.stock <= 0) {
        showToast(`"${product.title}" is currently out of stock.`);
        return false;
      }

      const cartItemId = `${product.id}_${selectedSize || 'Standard'}_${selectedColor || 'Default'}`;
      const existingItem = cart.find((item) => item.id === cartItemId);
      const currentQty = existingItem ? existingItem.quantity : 0;

      if (currentQty + quantity > product.stock) {
        showToast(`Only ${product.stock} units available in stock.`);
        return false;
      }

      const effectivePrice = product.discount && product.originalPrice
        ? Math.round(product.originalPrice * (1 - product.discount / 100))
        : product.price;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            productId: product.id,
            product,
            selectedSize: selectedSize || (product.sizes?.[0] ?? 'Standard'),
            selectedColor: selectedColor || (product.colors?.[0]?.name ?? 'Standard'),
            quantity,
            unitPrice: effectivePrice,
          };
          return [...prev, newItem];
        }
      });

      showToast(`Added "${product.title}" to your cart`);
      setIsCartDrawerOpen(true);
      return true;
    },
    [cart, showToast]
  );

  const moveWishlistToCart = useCallback(
    (product: Product, size?: string, color?: string) => {
      const chosenSize = size || product.sizes?.[0] || 'Standard';
      const chosenColor = color || product.colors?.[0]?.name || 'Standard';
      const added = addToCart(product, chosenSize, chosenColor, 1);
      if (added) {
        removeFromWishlist(product.id);
      }
    },
    [addToCart, removeFromWishlist]
  );

  const removeFromCart = useCallback(
    (cartItemId: string) => {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      showToast('Item removed from cart');
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    } else {
      setCart((prev) =>
        prev.map((item) => {
          if (item.id === cartItemId) {
            const maxAllowed = item.product.stock || 99;
            const finalQty = Math.min(quantity, maxAllowed);
            return { ...item, quantity: finalQty };
          }
          return item;
        })
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const buyNow = useCallback(
    (product: Product, selectedSize: string, selectedColor: string, quantity = 1) => {
      const success = addToCart(product, selectedSize, selectedColor, quantity);
      if (success) {
        setIsCartDrawerOpen(false);
        setActiveView('checkout');
      }
    },
    [addToCart]
  );

  // Navigation
  const openProduct = useCallback((productId: string) => {
    setSelectedProductId(productId);
    const updated = storeService.addRecentlyViewedProductId(productId);
    setRecentlyViewedIds(updated);
    setActiveView('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openSection = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    setActiveView('section-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openOrder = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveView('order-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openOrderTracking = useCallback((orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveView('order-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToHome = useCallback(() => {
    setSelectedSectionId(null);
    setSelectedProductId(null);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToCheckout = useCallback(() => {
    setIsCartDrawerOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToCart = useCallback(() => {
    setIsCartDrawerOpen(false);
    setActiveView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToWishlist = useCallback(() => {
    setActiveView('wishlist');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToAccount = useCallback(() => {
    setActiveView('account');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToContact = useCallback((prefillOrderNumber?: string) => {
    if (typeof prefillOrderNumber === 'string') {
      setContactPrefillOrderNumber(prefillOrderNumber);
    } else {
      setContactPrefillOrderNumber(null);
    }
    setActiveView('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToAbout = useCallback(() => {
    setActiveView('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToDeliveryInfo = useCallback(() => {
    setActiveView('delivery-info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToPaymentInfo = useCallback(() => {
    setActiveView('payment-info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToReturns = useCallback(() => {
    setActiveView('returns');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToPrivacy = useCallback(() => {
    setActiveView('privacy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToTerms = useCallback(() => {
    setActiveView('terms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToFAQ = useCallback(() => {
    setActiveView('faq');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToNotFound = useCallback(() => {
    setActiveView('not-found');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToAdminLogin = useCallback(() => {
    setActiveView('admin-login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToAdminPanel = useCallback((tab: AdminTab = 'dashboard') => {
    const admin = storeService.getCurrentAdmin();
    if (!admin) {
      setActiveView('admin-login');
    } else {
      setCurrentAdmin(admin);
      setAdminTab(tab);
      setActiveView('admin-panel');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const adminLogin = useCallback(async (identifier: string, passwordPlain: string) => {
    const result = storeService.adminLogin(identifier, passwordPlain);
    if (result.success && result.admin) {
      setCurrentAdmin(result.admin);
      setActiveView('admin-panel');
      showToast(`Welcome back, ${result.admin.name}!`);
      return { success: true };
    }
    return { success: false, error: result.error || 'Authentication failed.' };
  }, [showToast]);

  const adminLogout = useCallback(() => {
    storeService.logoutAdmin();
    setCurrentAdmin(null);
    setActiveView('admin-login');
    showToast('Admin session closed securely.');
  }, [showToast]);

  const startCreatingProduct = useCallback(() => {
    setAdminEditingProductId('new');
    setAdminTab('product-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const startEditingProduct = useCallback((id: string) => {
    setAdminEditingProductId(id);
    setAdminTab('product-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const cancelEditingProduct = useCallback(() => {
    setAdminEditingProductId(null);
    setAdminTab('products');
  }, []);

  // Synchronize dynamic SEO title and meta descriptions based on current view
  useEffect(() => {
    let title = storeConfig.storeName;
    let desc = storeConfig.tagline || 'Gondal Clothes House - Premier Clothing & Elegant Attire';

    if (activeView === 'product-detail' && selectedProductId) {
      const prod = products.find((p) => p.id === selectedProductId);
      if (prod) {
        title = `${prod.title} | ${storeConfig.storeName}`;
        desc = prod.shortDescription || prod.description.slice(0, 155) || desc;
      }
    } else if (activeView === 'section-detail' && selectedSectionId) {
      const sec = sections.find((s) => s.id === selectedSectionId);
      if (sec) {
        title = `${sec.name} Collection | ${storeConfig.storeName}`;
        desc = sec.description || `Explore ${sec.name} garments at ${storeConfig.storeName}.`;
      }
    } else if (activeView === 'about') {
      title = `About Us | ${storeConfig.storeName}`;
    } else if (activeView === 'contact') {
      title = `Contact Us & Boutique Support | ${storeConfig.storeName}`;
    } else if (activeView === 'faq') {
      title = `Frequently Asked Questions (FAQ) | ${storeConfig.storeName}`;
    } else if (activeView === 'delivery-info') {
      title = `Nationwide Delivery Information | ${storeConfig.storeName}`;
    } else if (activeView === 'payment-info') {
      title = `Payment Methods & COD Info | ${storeConfig.storeName}`;
    } else if (activeView === 'returns') {
      title = `Return & Exchange Policy | ${storeConfig.storeName}`;
    } else if (activeView === 'privacy') {
      title = `Privacy Policy | ${storeConfig.storeName}`;
    } else if (activeView === 'terms') {
      title = `Terms & Conditions | ${storeConfig.storeName}`;
    } else if (activeView === 'cart') {
      title = `Shopping Bag | ${storeConfig.storeName}`;
    } else if (activeView === 'checkout') {
      title = `Secure Checkout | ${storeConfig.storeName}`;
    } else if (activeView === 'wishlist') {
      title = `My Wishlist | ${storeConfig.storeName}`;
    } else if (activeView === 'account') {
      title = `My Account & Orders | ${storeConfig.storeName}`;
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', desc);
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', desc);
    }
  }, [activeView, selectedProductId, selectedSectionId, products, sections, storeConfig]);

  // Auth Operations
  const register = useCallback(
    async (name: string, email: string, phone: string, password?: string): Promise<User> => {
      const user = storeService.registerUser(name, email, phone, password);
      setCurrentUser(user);
      setWishlistProductIds(storeService.getWishlist(user.id));
      setSavedAddresses(storeService.getSavedAddresses(user.id));
      setNotifications(storeService.getNotifications(user.id));
      showToast(`Welcome to Gondal Clothes House, ${user.name}!`);
      return user;
    },
    [showToast]
  );

  const login = useCallback(
    async (email: string): Promise<User> => {
      const user = storeService.loginUser(email);
      setCurrentUser(user);
      setWishlistProductIds(storeService.getWishlist(user.id));
      setSavedAddresses(storeService.getSavedAddresses(user.id));
      setNotifications(storeService.getNotifications(user.id));
      showToast(`Welcome back, ${user.name}!`);
      return user;
    },
    [showToast]
  );

  const logout = useCallback(() => {
    storeService.setCurrentUser(null);
    setCurrentUser(null);
    setWishlistProductIds(storeService.getWishlist());
    setSavedAddresses(storeService.getSavedAddresses());
    setNotifications(storeService.getNotifications());
    showToast('You have been logged out.');
  }, [showToast]);

  const updateContactInfo = useCallback(
    (address: UserAddress): User => {
      if (!currentUser) throw new Error('You must be logged in to update contact info.');
      const updated = storeService.updateUserAddress(currentUser.id, address);
      setCurrentUser(updated);
      showToast('Contact and delivery details saved.');
      return updated;
    },
    [currentUser, showToast]
  );

  // Orders
  const placeOrder = useCallback(
    async (shippingAddress: UserAddress, paymentMethod: PaymentMethod): Promise<Order> => {
      if (cart.length === 0) throw new Error('Cart is empty.');

      // Validate real stock on server/store service before order confirmation
      const freshProducts = storeService.getProducts();
      for (const item of cart) {
        const liveProduct = freshProducts.find((p) => p.id === item.productId);
        if (!liveProduct || liveProduct.status !== 'active') {
          throw new Error(`"${item.product.title}" is no longer available. Please update your cart.`);
        }
        if (liveProduct.stock < item.quantity) {
          throw new Error(`Only ${liveProduct.stock} units available for "${item.product.title}". Please adjust quantity.`);
        }
      }
      
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        title: item.product.title,
        image: item.product.images?.[0] || '',
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.unitPrice * item.quantity,
      }));

      const newOrder = storeService.createOrder({
        customerId: currentUser?.id,
        customerName: shippingAddress.fullName,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        shippingAddress,
        items: orderItems,
        subtotal: cartSubtotal,
        deliveryFee,
        discount: cartDiscount,
        total: cartTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      });

      // Also automatically add address to user's saved addresses if not already existing
      if (currentUser?.id) {
        const existingAddrs = storeService.getSavedAddresses(currentUser.id);
        const match = existingAddrs.find(
          (a) => a.address.toLowerCase() === shippingAddress.address.toLowerCase()
        );
        if (!match) {
          storeService.saveAddress(
            {
              fullName: shippingAddress.fullName,
              phone: shippingAddress.phone,
              email: shippingAddress.email,
              country: 'Pakistan',
              city: shippingAddress.city,
              area: shippingAddress.area,
              address: shippingAddress.address,
              postalCode: shippingAddress.postalCode,
              instructions: shippingAddress.instructions,
              isDefault: existingAddrs.length === 0,
            },
            currentUser.id
          );
          setSavedAddresses(storeService.getSavedAddresses(currentUser.id));
        }
      }

      // Clear the cart
      setCart([]);
      setSelectedOrderId(newOrder.id);
      setActiveView('order-confirmation');
      setNotifications(storeService.getNotifications(currentUser?.id));
      showToast(`Order ${newOrder.orderNumber} placed successfully!`);
      return newOrder;
    },
    [cart, cartDiscount, cartSubtotal, cartTotal, currentUser?.id, deliveryFee, showToast]
  );

  const cancelOrder = useCallback(
    async (orderId: string, reason?: string): Promise<Order> => {
      const updatedOrder = storeService.cancelOrder(orderId, reason, currentUser?.id);
      setNotifications(storeService.getNotifications(currentUser?.id));
      setProducts(storeService.getProducts());
      showToast(`Order #${updatedOrder.orderNumber} cancelled.`);
      return updatedOrder;
    },
    [currentUser?.id, showToast]
  );

  const hasPurchasedProduct = useCallback(
    (productId: string): boolean => {
      if (!currentUser) return false;
      return storeService.hasPurchasedProduct(productId, currentUser.id);
    },
    [currentUser]
  );

  // Reviews
  const submitReview = useCallback(
    async (productId: string, comment: string, rating: number, customerName?: string) => {
      const author = customerName || currentUser?.name || 'Customer';
      const isVerified = currentUser ? storeService.hasPurchasedProduct(productId, currentUser.id) : false;
      storeService.addComment({
        productId,
        customerId: currentUser?.id,
        customerName: author,
        comment,
        rating,
        isVerifiedPurchase: isVerified,
      });
      setNotifications(storeService.getNotifications(currentUser?.id));
      showToast('Thank you! Your review has been submitted.');
    },
    [currentUser, showToast]
  );

  const updateReview = useCallback(
    async (commentId: string, comment: string, rating: number) => {
      storeService.updateComment(commentId, comment, rating, currentUser?.id);
      showToast('Your review was updated successfully.');
    },
    [currentUser?.id, showToast]
  );

  const deleteReview = useCallback(
    async (commentId: string) => {
      storeService.deleteComment(commentId, currentUser?.id);
      showToast('Your review was deleted.');
    },
    [currentUser?.id, showToast]
  );

  // Questions
  const submitQuestion = useCallback(
    async (productId: string, question: string, customerName?: string) => {
      const author = customerName || currentUser?.name || 'Customer';
      storeService.addQuestion(productId, author, question, currentUser?.id);
      showToast('Your question was submitted. Store associates will respond promptly.');
    },
    [currentUser?.id, currentUser?.name, showToast]
  );

  // Messages
  const sendContactMessage = useCallback(
    async (name: string, phone: string, email: string, message: string, subject?: string, orderNumber?: string) => {
      storeService.sendMessage({
        customerId: currentUser?.id,
        name,
        phone,
        email,
        subject,
        orderNumber,
        message,
      });
      setNotifications(storeService.getNotifications(currentUser?.id));
      showToast('Your inquiry has been sent to Gondal Clothes House team.');
    },
    [currentUser?.id, showToast]
  );

  return (
    <StoreContext.Provider
      value={{
        storeConfig,
        sections,
        publishedSections,
        products,
        activeProducts,
        cart,
        cartCount,
        cartSubtotal,
        deliveryFee,
        cartDiscount,
        cartTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlistProductIds,
        wishlistProducts,
        wishlistCount,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        moveWishlistToCart,
        notifications,
        unreadNotificationCount,
        isNotificationsOpen,
        setIsNotificationsOpen,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        savedAddresses,
        defaultAddress,
        saveAddress,
        deleteAddress,
        setDefaultAddress,
        currentUser,
        activeView,
        setActiveView,
        selectedSectionId,
        setSelectedSectionId,
        selectedProductId,
        setSelectedProductId,
        selectedOrderId,
        setSelectedOrderId,
        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        contactPrefillOrderNumber,
        setContactPrefillOrderNumber,
        recentlyViewedProducts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        buyNow,
        openProduct,
        openSection,
        openOrder,
        openOrderTracking,
        goToHome,
        goToCheckout,
        goToCart,
        goToWishlist,
        goToAccount,
        goToContact,
        goToAbout,
        goToDeliveryInfo,
        goToPaymentInfo,
        goToReturns,
        goToPrivacy,
        goToTerms,
        goToFAQ,
        goToNotFound,
        goToAdminLogin,
        goToAdminPanel,
        currentAdmin,
        adminTab,
        setAdminTab,
        adminEditingProductId,
        setAdminEditingProductId,
        adminEditingSectionId,
        setAdminEditingSectionId,
        adminEditingOrderId,
        setAdminEditingOrderId,
        startCreatingProduct,
        startEditingProduct,
        cancelEditingProduct,
        adminLogin,
        adminLogout,
        register,
        login,
        logout,
        updateContactInfo,
        placeOrder,
        cancelOrder,
        hasPurchasedProduct,
        submitReview,
        updateReview,
        deleteReview,
        submitQuestion,
        sendContactMessage,
        toastMessage,
        showToast,
        refreshData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
