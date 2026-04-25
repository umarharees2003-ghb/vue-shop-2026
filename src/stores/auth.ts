import { defineStore } from 'pinia';
import type { AuthUser } from '../types';
import apiService from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    isAuthenticated: false,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await apiService.login({ username, password });
        // AuthResponse includes all AuthUser fields
        this.user = response;
        this.token = response.token;
        this.isAuthenticated = true;
        this.saveToLocalStorage();
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('auth');
    },
    saveToLocalStorage() {
      localStorage.setItem('auth', JSON.stringify({
        user: this.user,
        token: this.token,
      }));
    },
    async loadFromLocalStorage() {
      const saved = localStorage.getItem('auth');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.token = data.token;
          this.isAuthenticated = !!data.token;

          if (this.token) {
            try {
              const response = await apiService.getCurrentUser(this.token);
              this.user = response;
              this.isAuthenticated = true;
            } catch (e) {
              this.logout();
            }
          }
        } catch {
          this.logout();
        }
      }
    },
  },
});