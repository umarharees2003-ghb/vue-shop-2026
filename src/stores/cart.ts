import { defineStore } from 'pinia';
import type { Product, CartItem } from '../types';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  },
  actions: {
    addItem(product: Product) {
      const existingItem = this.items.find(item => item.product.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ product, quantity: 1 });
      }
      this.saveToLocalStorage();
    },
    removeItem(productId: number) {
      const index = this.items.findIndex(item => item.product.id === productId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
      this.saveToLocalStorage();
    },
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
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('cart');
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