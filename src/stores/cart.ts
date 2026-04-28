import { defineStore } from 'pinia';
import type { Product, CartItem } from '../types';

/**
 * CartStore - Manages the user's shopping cart state
 * Handles adding, removing, updating items and persists cart to localStorage
 */
export const useCartStore = defineStore('cart', {
  // Initial state - empty cart
  state: () => ({
    items: [] as CartItem[],
  }),

  // Computed values derived from state
  getters: {
    // Total number of unique items in cart
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    
    // Total price of all items in cart (quantity * price)
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  },

  actions: {
    /**
     * Adds a product to the cart or increments quantity if already there
     */
    addItem(product: Product) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        // Product already in cart - increase quantity
        existingItem.quantity++;
      } else {
        // New product - add with quantity of 1
        this.items.push({ product, quantity: 1 });
      }
      this.saveToLocalStorage();
    },

    /**
     * Removes a product from the cart entirely
     */
    removeItem(productId: number) {
      const index = this.items.findIndex(item => item.product.id === productId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
      this.saveToLocalStorage();
    },

    /**
     * Updates the quantity of a specific item
     * If quantity drops to 0 or less, removes the item
     */
    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.product.id === productId);
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId);
        } else {
          item.quantity = quantity;
        }
      }
      this.saveToLocalStorage();
    },

    /**
     * Clears all items from the cart (after successful checkout)
     */
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },

    /**
     * Persists cart state to localStorage for session persistence
     */
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    /**
     * Loads cart state from localStorage on app initialization
     */
    loadFromLocalStorage() {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          this.items = JSON.parse(saved);
        } catch {
          // If data is corrupted, start with empty cart
          this.items = [];
        }
      }
    },
  },
});