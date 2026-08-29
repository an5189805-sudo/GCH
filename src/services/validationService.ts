/**
 * Gondal Clothes House - Validation Service
 * Rigorous frontend & backend data validation and security sanitization
 */

import { CartItem, Product, UserAddress, PaymentMethod } from '../types';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  errors?: Record<string, string>;
}

export class ValidationService {
  /**
   * Validates Pakistani mobile phone numbers
   * Supports: +923001234567, 03001234567, 923001234567, 0300-1234567, etc.
   */
  static validatePhone(phone: string): { isValid: boolean; error?: string; formatted?: string } {
    if (!phone || !phone.trim()) {
      return { isValid: false, error: 'Phone number is required.' };
    }
    const clean = phone.replace(/[\s\-()]/g, '');
    
    // Pattern for Pakistani mobile networks (03xx or +923xx or 923xx)
    const pkMobileRegex = /^(?:\+92|92|0)?3[0-9]{9}$/;
    // Generic international pattern fallback (10 to 15 digits)
    const generalRegex = /^\+?[0-9]{10,15}$/;

    if (pkMobileRegex.test(clean)) {
      // Standardize to e.g. +92 3xx xxxxxxx or 03xx xxxxxxx
      let standardized = clean;
      if (standardized.startsWith('0')) {
        standardized = '+92' + standardized.substring(1);
      } else if (!standardized.startsWith('+')) {
        standardized = '+' + standardized;
      }
      return { isValid: true, formatted: standardized };
    } else if (generalRegex.test(clean)) {
      return { isValid: true, formatted: clean.startsWith('+') ? clean : '+' + clean };
    }

    return {
      isValid: false,
      error: 'Please enter a valid active phone number (e.g. 0300 1234567 or +92 300 1234567).',
    };
  }

  /**
   * Validates email address format
   */
  static validateEmail(email: string): { isValid: boolean; error?: string } {
    if (!email || !email.trim()) {
      return { isValid: false, error: 'Email address is required.' };
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return { isValid: false, error: 'Please provide a valid email address (e.g. name@gmail.com).' };
    }
    return { isValid: true };
  }

  /**
   * Validates full shipping address
   */
  static validateShippingAddress(addr: Partial<UserAddress>): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    if (!addr.fullName || addr.fullName.trim().length < 2) {
      errors.fullName = 'Full recipient name is required (min 2 characters).';
    }

    const phoneCheck = this.validatePhone(addr.phone || '');
    if (!phoneCheck.isValid) {
      errors.phone = phoneCheck.error || 'Valid phone number is required.';
    }

    const emailCheck = this.validateEmail(addr.email || '');
    if (!emailCheck.isValid) {
      errors.email = emailCheck.error || 'Valid email address is required.';
    }

    if (!addr.address || addr.address.trim().length < 5) {
      errors.address = 'Complete delivery street address is required (house/shop no, street, landmark).';
    }

    if (!addr.city || addr.city.trim().length < 2) {
      errors.city = 'City name is required (e.g. Gujrat, Lahore, Islamabad).';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validates cart items against live published database inventory
   * Prevents stock overselling and price tampering
   */
  static validateCartAgainstInventory(
    cart: CartItem[],
    liveProducts: Product[]
  ): { isValid: boolean; errors: string[]; validatedCart: CartItem[] } {
    const errors: string[] = [];
    const validatedCart: CartItem[] = [];

    if (!cart || cart.length === 0) {
      return { isValid: false, errors: ['Shopping cart is empty.'], validatedCart: [] };
    }

    for (const item of cart) {
      const liveProduct = liveProducts.find((p) => p.id === item.productId);

      if (!liveProduct) {
        errors.push(`"${item.product.title}" is no longer available.`);
        continue;
      }

      if (liveProduct.status !== 'active') {
        errors.push(`"${liveProduct.title}" is currently unpublished.`);
        continue;
      }

      if (liveProduct.stock <= 0) {
        errors.push(`"${liveProduct.title}" is out of stock.`);
        continue;
      }

      if (item.quantity > liveProduct.stock) {
        errors.push(
          `Only ${liveProduct.stock} unit(s) available for "${liveProduct.title}" (you requested ${item.quantity}).`
        );
        continue;
      }

      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for "${liveProduct.title}".`);
        continue;
      }

      // Lock real calculated unit price to protect against client price manipulation
      const calculatedUnitPrice =
        liveProduct.discount && liveProduct.discount > 0
          ? Math.round(liveProduct.price * (1 - liveProduct.discount / 100))
          : liveProduct.price;

      validatedCart.push({
        ...item,
        product: liveProduct,
        unitPrice: calculatedUnitPrice,
      });
    }

    return {
      isValid: errors.length === 0 && validatedCart.length === cart.length,
      errors,
      validatedCart,
    };
  }

  /**
   * Validates media files before upload or preview
   */
  static validateMediaFile(
    file: { type: string; size: number; name?: string },
    maxImageSizeBytes = 5 * 1024 * 1024, // 5MB
    maxVideoSizeBytes = 25 * 1024 * 1024 // 25MB
  ): { isValid: boolean; error?: string; mediaType: 'image' | 'video' | 'unknown' } {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      return {
        isValid: false,
        error: 'Unsupported file format. Please upload JPEG, PNG, WEBP, AVIF images or MP4/WEBM videos.',
        mediaType: 'unknown',
      };
    }

    if (isImage) {
      const allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
      if (!allowedImageMimes.includes(file.type.toLowerCase())) {
        return {
          isValid: false,
          error: 'Only JPEG, PNG, WEBP, and AVIF image formats are allowed.',
          mediaType: 'image',
        };
      }
      if (file.size > maxImageSizeBytes) {
        return {
          isValid: false,
          error: `Image file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 5MB.`,
          mediaType: 'image',
        };
      }
      return { isValid: true, mediaType: 'image' };
    }

    if (isVideo) {
      const allowedVideoMimes = ['video/mp4', 'video/webm', 'video/quicktime'];
      if (!allowedVideoMimes.includes(file.type.toLowerCase())) {
        return {
          isValid: false,
          error: 'Only MP4 and WebM video formats are allowed.',
          mediaType: 'video',
        };
      }
      if (file.size > maxVideoSizeBytes) {
        return {
          isValid: false,
          error: `Video file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max size is 25MB.`,
          mediaType: 'video',
        };
      }
      return { isValid: true, mediaType: 'video' };
    }

    return { isValid: false, error: 'Unknown file format.', mediaType: 'unknown' };
  }

  /**
   * Sanitizes string inputs to prevent HTML/script injection
   */
  static sanitizeString(input: string): string {
    if (!input) return '';
    return input
      .trim()
      .replace(/[<>]/g, '') // strip raw html brackets
      .slice(0, 5000); // cap max length
  }
}
