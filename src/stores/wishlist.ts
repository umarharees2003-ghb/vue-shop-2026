import { defineStore } from 'pinia';
import type { Product } from '../types';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [] as Product[],
  }),
  actions: {
    toggleItem(product: Product) {
      const index = this.items.findIndex(p => p.id === product.id);
      if (index > -1) {
        this.items.splice(index, 1);
      } else {
        this.items.push(product);
      }
      this.saveToLocalStorage();
    },
    isInWishlist(productId: number) {
      return this.items.some(p => p.id === productId);
    },
    saveToLocalStorage() {
      localStorage.setItem('wishlist', JSON.stringify(this.items));
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('wishlist');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    }
  }
});