import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
      this.saveToLocalStorage();
    },
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    saveToLocalStorage() {
      localStorage.setItem('theme', JSON.stringify({ isDark: this.isDark }));
    },
    loadFromLocalStorage() {
      const saved = localStorage.getItem('theme');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          this.isDark = data.isDark;
          this.applyTheme();
        } catch {
          // Use system preference
          if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true;
            this.applyTheme();
          }
        }
      }
    },
  },
});