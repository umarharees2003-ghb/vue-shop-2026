import { defineStore } from 'pinia';
import type { Product } from '../types';

export const useViewedStore = defineStore('viewed', {
  state: () => ({
    items: [] as Product[],
    limit: 8,
  }),
  actions: {
    addProduct(product: Product) {
      // Remove if already exists to avoid duplicates and move to top
      const index = this.items.findIndex(p => p.id === product.id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
      
      // Add to beginning of array
      this.items.unshift(product);
      
      // Keep only the most recent items
      if (this.items.length > this.limit) {
        this.items = this.items.slice(0, this.limit);
      }
      
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('viewed_products', JSON.stringify(this.items));
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('viewed_products');
      if (saved) {
        try {
          this.items = JSON.parse(saved);
        } catch {
          this.items = [];
        }
      }
    },
  },
});