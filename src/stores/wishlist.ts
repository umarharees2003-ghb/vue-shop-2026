import { defineStore } from 'pinia';
import type { Product } from '../types';

/**
 * WishlistStore - Manages the user's saved favorites/wishlist
 * Allows users to save products they love for later
 */
export const useWishlistStore = defineStore('wishlist', {
  // State: Array of saved products
  state: () => ({
    items: [] as Product[],
  }),

  actions: {
    /**
     * Toggles a product in/out of the wishlist
     * If already in wishlist, removes it; otherwise adds it
     */
    toggleItem(product: Product) {
      const index = this.items.findIndex(p => p.id === product.id);
      if (index > -1) {
        // Product exists - remove it
        this.items.splice(index, 1);
      } else {
        // New product - add to wishlist
        this.items.push(product);
      }
      this.saveToLocalStorage();
    },

    /**
     * Checks if a product is currently in the wishlist
     */
    isInWishlist(productId: number) {
      return this.items.some(p => p.id === productId);
    },

    /**
     * Persists wishlist to localStorage
     */
    saveToLocalStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.items));
    },

    /**
     * Loads wishlist from localStorage on app start
     */
    loadFromLocalStorage() {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    }
  }
});