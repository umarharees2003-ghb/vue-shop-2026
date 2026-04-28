import { defineStore } from 'pinia';

/**
 * ThemeStore - Manages the application's light/dark theme preference
 * Persists user preference and respects system color scheme
 */
export const useThemeStore = defineStore('theme', {
  // State: Track whether dark mode is active
  state: () => ({
    isDark: false,
  }),

  actions: {
    /**
     * Toggles between light and dark theme
     */
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
      this.saveToLocalStorage();
    },

    /**
     * Applies the current theme to the document
     * Adds or removes 'dark' class on the HTML element
     */
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    /**
     * Persists theme preference to localStorage
     */
    saveToLocalStorage() {
      localStorage.setItem('theme', JSON.stringify({ isDark: this.isDark }));
    },

    /**
     * Loads theme preference from localStorage
     * Falls back to system preference if no saved preference exists
     */
    loadFromLocalStorage() {
      const saved = localStorage.getItem('theme');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.isDark = data.isDark;
          this.applyTheme();
        } catch {
          // No saved preference - use system preference
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true;
            this.applyTheme();
          }
        }
      }
    },
  },
});