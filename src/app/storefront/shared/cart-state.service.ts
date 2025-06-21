import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../../proxy/carts/cart.service';
import { CartDto } from '../../proxy/carts/dtos/models';
import { AuthService, ConfigStateService } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private cartSubject = new BehaviorSubject<CartDto | null>(null);
  cart$ = this.cartSubject.asObservable();
  private isAddingItem = false; // Prevent double additions
  private isInitialized = false;
  private addItemQueue = new Map<string, number>(); // Track pending additions by productId

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private config: ConfigStateService
  ) {
    // Mark that we're starting fresh (important for debugging)
    console.log('🛒 CartStateService initialized');
    
    // Initialize cart immediately
    this.initializeCart();
  }

  private initializeCart(): void {
    if (this.isInitialized) return;
    
    console.log('🛒 Initializing cart...');
    
    // Always load from cache first for immediate UI feedback
    this.loadFromCache();
    
    // Then sync with server
    setTimeout(() => this.syncCartWithServer(), 100);
    
    this.isInitialized = true;
  }

  private loadFromCache(): void {
    const cachedJson = localStorage.getItem('cartCache');
    if (cachedJson) {
      try {
        const cachedCart: CartDto = JSON.parse(cachedJson);
        console.log('🛒 Loaded cart from cache:', cachedCart);
        this.cartSubject.next(cachedCart);
      } catch (error) {
        console.warn('Failed to parse cached cart:', error);
        localStorage.removeItem('cartCache');
      }
    }
  }

  private syncCartWithServer(): void {
    console.log('🛒 Syncing cart with server...');
    
    if (this.authService.isAuthenticated) {
      // For authenticated users, get cart from database
      const user: any = this.config.getDeep('currentUser');
      const userId = user?.id ?? user?.userId;
      if (userId) {
        console.log('🛒 Loading cart for authenticated user:', userId);
        this.cartService.getCartByUserId(userId).subscribe({
          next: (cart) => {
            console.log('🛒 Server cart for user:', cart);
            if (cart && cart.items && cart.items.length > 0) {
              this.pushCart(cart);
            } else if (!this.cartSubject.value || !this.cartSubject.value.items?.length) {
              // No server cart and no local cart, create empty cart
              this.createEmptyCart(userId);
            }
          },
          error: (error) => {
            console.warn('Failed to load user cart:', error);
            // Keep cached cart if server fails
          },
        });
      }
    } else {
      // For guest users, get cart by ID from localStorage
      const cartId = localStorage.getItem('cartId');
      if (cartId) {
        console.log('🛒 Loading guest cart:', cartId);
        this.cartService.get(cartId).subscribe({
          next: (cart) => {
            console.log('🛒 Server cart for guest:', cart);
            if (cart) {
              this.pushCart(cart);
            }
          },
          error: (error) => {
            console.warn('Failed to load guest cart:', error);
            // Remove invalid cart ID
            localStorage.removeItem('cartId');
          },
        });
      }
    }
  }

  private createEmptyCart(userId?: string): void {
    const userIdToUse = userId || (this.authService.isAuthenticated
      ? this.config.getDeep('currentUser')?.id ?? this.config.getDeep('currentUser')?.userId
      : '00000000-0000-0000-0000-000000000000');
      
    this.cartService.create({ userId: userIdToUse }).subscribe({
      next: (newCart) => {
        console.log('🛒 Created new cart:', newCart);
        this.pushCart(newCart);
      },
      error: (error) => {
        console.error('Failed to create cart:', error);
      }
    });
  }

  addItem(productId: string, quantity: number = 1): void {
    // Check if we're already processing this product (within last 2 seconds)
    const lastAddTime = this.addItemQueue.get(productId);
    if (lastAddTime && (Date.now() - lastAddTime) < 2000) {
      console.log(`🛒 Already processing ${productId}, ignoring duplicate request`);
      return;
    }
    
    const safeQuantity = Math.max(1, Math.floor(quantity || 1));
    console.log(`🛒 Adding item to cart: ${productId} (qty: ${safeQuantity})`);
    
    // Mark this product as being processed
    this.addItemQueue.set(productId, Date.now());
    
    const currentCart = this.cartSubject.value;
    
    if (currentCart && currentCart.id) {
      console.log('🛒 Adding to existing cart:', currentCart.id);
      
      // Always use the backend addItemToCart API which handles increment logic
      this.cartService
        .addItemToCart(currentCart.id, { productId, quantity: safeQuantity })
        .subscribe({
          next: (cart) => {
            console.log('🛒 Item added/updated successfully:', cart);
            this.pushCart(cart);
            this.addItemQueue.delete(productId);
          },
          error: (error) => {
            console.error('Error adding item to cart:', error);
            this.addItemQueue.delete(productId);
          }
        });
    } else {
      console.log('🛒 No existing cart, creating new one');
      this.createCartAndAddItem(productId, safeQuantity);
    }
  }

  // Method to increment quantity of existing item or add new item
  incrementItem(productId: string, quantity: number = 1): void {
    const existingItem = this.getCartItemByProductId(productId);
    
    if (existingItem) {
      console.log('🛒 Incrementing existing item quantity');
      const newQuantity = (existingItem.quantity || 0) + quantity;
      this.updateItemQuantity(existingItem.id, newQuantity);
    } else {
      console.log('🛒 Item not in cart, adding new');
      this.addItem(productId, quantity);
    }
  }

  // Method to check if a product exists in cart
  isProductInCart(productId: string): boolean {
    const cart = this.cartSubject.value;
    return !!(cart?.items?.some(item => item.productId === productId));
  }

  // Method to get cart item for a specific product
  getCartItemByProductId(productId: string): any {
    const cart = this.cartSubject.value;
    return cart?.items?.find(item => item.productId === productId);
  }

  // Method to set exact quantity for a product (use this for direct quantity control)
  setItemQuantity(productId: string, quantity: number): void {
    const safeQuantity = Math.max(1, Math.floor(quantity));
    const existingItem = this.getCartItemByProductId(productId);
    
    if (existingItem) {
      console.log(`🛒 Setting quantity for ${productId} to ${safeQuantity}`);
      this.updateItemQuantity(existingItem.id, safeQuantity);
    } else {
      console.log(`🛒 Product not in cart, adding with quantity ${safeQuantity}`);
      this.addNewItem(productId, safeQuantity);
    }
  }

  // Method to add item without checking for existing quantities (force new addition)
  addNewItem(productId: string, quantity: number = 1): void {
    if (this.isAddingItem) {
      console.log('🛒 Already adding item, ignoring duplicate request');
      return;
    }
    
    const safeQuantity = Math.max(1, Math.floor(quantity || 1));
    console.log(`🛒 Force adding new item: ${productId} (qty: ${safeQuantity})`);
    this.isAddingItem = true;
    
    const currentCart = this.cartSubject.value;
    
    if (currentCart && currentCart.id) {
      this.cartService
        .addItemToCart(currentCart.id, { productId, quantity: safeQuantity })
        .subscribe({
          next: (cart) => {
            console.log('🛒 New item added successfully:', cart);
            this.pushCart(cart);
            this.isAddingItem = false;
          },
          error: (error) => {
            console.error('Error adding new item to cart:', error);
            this.isAddingItem = false;
          }
        });
    } else {
      this.createCartAndAddItem(productId, safeQuantity);
    }
  }

  private createCartAndAddItem(productId: string, quantity: number): void {
    const userId = this.authService.isAuthenticated
      ? this.config.getDeep('currentUser')?.id ?? this.config.getDeep('currentUser')?.userId
      : '00000000-0000-0000-0000-000000000000';
      
    this.cartService.create({ userId }).subscribe({
      next: (newCart) => {
        console.log('🛒 New cart created:', newCart);
        this.pushCart(newCart);
        
        this.cartService
          .addItemToCart(newCart.id, { productId, quantity })
          .subscribe({
            next: (cart) => {
              console.log('🛒 Item added to new cart:', cart);
              this.pushCart(cart);
              this.addItemQueue.delete(productId); // Clear the lock
            },
            error: (error) => {
              console.error('Error adding item to new cart:', error);
              this.addItemQueue.delete(productId); // Clear the lock on error
            }
          });
      },
      error: (error) => {
        console.error('Error creating cart:', error);
        this.addItemQueue.delete(productId); // Clear the lock on error
      }
    });
  }

  updateItemQuantity(cartItemId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;
    
    console.log(`🛒 Updating cart item ${cartItemId} quantity to ${quantity}`);
    this.cartService
      .updateCartItemQuantity(cartItemId, quantity)
      .subscribe({
        next: (cart) => {
          console.log('🛒 Cart item quantity updated:', cart);
          this.pushCart(cart);
        },
        error: (error) => {
          console.error('Error updating cart item quantity:', error);
        }
      });
  }

  removeItem(cartItemId: string): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;
    
    console.log(`🛒 Removing cart item: ${cartItemId}`);
    this.cartService
      .removeItemFromCart(cartItemId)
      .subscribe({
        next: (cart) => {
          console.log('🛒 Cart item removed:', cart);
          this.pushCart(cart);
        },
        error: (error) => {
          console.error('Error removing cart item:', error);
        }
      });
  }

  clearCart(): void {
    const currentCart = this.cartSubject.value;
    if (!currentCart) return;
    this.cartService.clearCart(currentCart.id).subscribe({
      next: (cart) => {
        this.pushCart(cart);
        // Only remove cart ID if cart is actually empty
        if (!cart.items || cart.items.length === 0) {
          localStorage.removeItem('cartId');
          localStorage.removeItem('cartCache');
        }
      },
      error: (error) => {
        console.error('Error clearing cart:', error);
      }
    });
  }

  // Method to completely reset cart (for when order is placed)
  resetCart(): void {
    console.log('🛒 Resetting cart');
    this.cartSubject.next(null);
    localStorage.removeItem('cartId');
    localStorage.removeItem('cartCache');
    this.isInitialized = false;
  }

  // Method to handle logout (clear cart but keep guest cart functionality)
  onLogout(): void {
    console.log('🛒 User logged out, clearing cart');
    this.cartSubject.next(null);
    localStorage.removeItem('cartCache');
    // Keep cartId for guest functionality
    this.isInitialized = false;
    // Reinitialize as guest
    setTimeout(() => this.initializeCart(), 100);
  }

  getItemCount(): number {
    const cart = this.cartSubject.value;
    return cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;
  }

  // Public method to force cart reload
  reloadCart(): void {
    console.log('🛒 Force reloading cart');
    this.isInitialized = false;
    this.initializeCart();
  }

  // Debug method to log current cart state
  debugCart(): void {
    const cart = this.cartSubject.value;
    console.log('🛒 Current cart state:', {
      cart,
      itemCount: this.getItemCount(),
      cartId: localStorage.getItem('cartId'),
      hasCache: !!localStorage.getItem('cartCache'),
      isAuthenticated: this.authService.isAuthenticated,
      isInitialized: this.isInitialized,
      isAddingItem: this.isAddingItem
    });
  }

  private pushCart(cart: CartDto): void {
    console.log('🛒 Updating cart state:', cart);
    this.cartSubject.next(cart);
    
    try {
      // Always cache the cart
      localStorage.setItem('cartCache', JSON.stringify(cart));
      
      // Store cart ID (for both guest and authenticated users for backup)
      if (cart.id) {
        localStorage.setItem('cartId', cart.id);
      }
      
      console.log('🛒 Cart cached successfully');
    } catch (error) {
      console.warn('Failed to cache cart:', error);
    }
  }
} 