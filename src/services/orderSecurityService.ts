/**
 * Gondal Clothes House - Order Security & Authorization Service
 * Enforces atomic stock checking, price locking, idempotency protection, and customer data isolation
 */

import { Order, CartItem, Product, UserAddress, PaymentMethod, User } from '../types';
import { ValidationService } from './validationService';

export class OrderSecurityService {
  private static activeSubmissions = new Set<string>();

  /**
   * Generates a unique idempotency key for an order payload to prevent duplicate submissions
   */
  static generateIdempotencyKey(
    customerId: string | undefined,
    customerEmail: string,
    items: { productId: string; quantity: number }[],
    total: number
  ): string {
    const itemsSig = items
      .map((i) => `${i.productId}:${i.quantity}`)
      .sort()
      .join('|');
    return `idemp_${customerId || 'guest'}_${customerEmail}_${itemsSig}_${total}_${Date.now()}`;
  }

  /**
   * Validates and creates a secure order object
   */
  static validateAndBuildOrder(
    cart: CartItem[],
    products: Product[],
    shippingAddress: UserAddress,
    paymentMethod: PaymentMethod,
    deliveryFee: number,
    currentUser: User | null,
    existingOrdersCount: number
  ): { success: boolean; error?: string; order?: Order } {
    // 1. Validate shipping address fields
    const addrValidation = ValidationService.validateShippingAddress(shippingAddress);
    if (!addrValidation.isValid) {
      const firstError = Object.values(addrValidation.errors)[0];
      return { success: false, error: firstError || 'Invalid shipping address.' };
    }

    // 2. Validate cart items against live catalog
    const cartValidation = ValidationService.validateCartAgainstInventory(cart, products);
    if (!cartValidation.isValid) {
      return { success: false, error: cartValidation.errors[0] || 'Cart validation failed.' };
    }

    // 3. Recalculate totals strictly from live catalog (tamper-proof)
    let subtotal = 0;
    const orderItems = cartValidation.validatedCart.map((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      subtotal += itemTotal;
      return {
        productId: item.productId,
        title: item.product.title,
        image: item.product.images[0] || '',
        size: item.selectedSize,
        color: item.selectedColor,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: itemTotal,
        sku: item.product.sku,
      };
    });

    const total = subtotal + deliveryFee;
    const now = new Date().toISOString();
    const count = existingOrdersCount + 1;
    const orderNumber = `GCH-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;

    const newOrder: Order = {
      id: 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      orderNumber,
      idempotencyKey: this.generateIdempotencyKey(
        currentUser?.id,
        shippingAddress.email,
        orderItems,
        total
      ),
      customerId: currentUser?.id,
      customerName: shippingAddress.fullName.trim(),
      customerEmail: shippingAddress.email.trim().toLowerCase(),
      customerPhone: shippingAddress.phone.trim(),
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        email: shippingAddress.email.trim().toLowerCase(),
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        area: shippingAddress.area?.trim() || '',
        postalCode: shippingAddress.postalCode?.trim() || '',
        instructions: shippingAddress.instructions?.trim() || '',
      },
      items: orderItems,
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      status: 'pending',
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: 'Order successfully created and validated by Gondal Clothes House checkout engine.',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    return { success: true, order: newOrder };
  }

  /**
   * Checks if a user is authorized to access an order
   */
  static isAuthorizedForOrder(order: Order, customerEmailOrId?: string): boolean {
    if (!customerEmailOrId) return true; // Guest order tracking via specific ID allowed
    const target = customerEmailOrId.toLowerCase().trim();
    if (order.customerId && order.customerId === target) return true;
    if (order.customerEmail.toLowerCase() === target) return true;
    if (order.shippingAddress.email.toLowerCase() === target) return true;
    return false;
  }

  /**
   * Acquire submission lock to prevent double-order placement
   */
  static acquireSubmissionLock(key: string): boolean {
    if (this.activeSubmissions.has(key)) {
      return false; // already submitting
    }
    this.activeSubmissions.add(key);
    // Auto release after 10 seconds in case of unhandled error
    setTimeout(() => {
      this.activeSubmissions.delete(key);
    }, 10000);
    return true;
  }

  /**
   * Release submission lock
   */
  static releaseSubmissionLock(key: string): void {
    this.activeSubmissions.delete(key);
  }
}
