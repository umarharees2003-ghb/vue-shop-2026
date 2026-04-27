<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, Category } from './types';
import apiService from './services/api';
import { useCartStore } from './stores/cart';
import { useAuthStore } from './stores/auth';
import { useThemeStore } from './stores/theme';
import { useViewedStore } from './types/viewed';

// Components
import NavBar from './components/NavBar.vue';
import ProductCard from './components/ProductCard.vue';
import FilterBar from './components/FilterBar.vue';
import ProductModal from './components/ProductModal.vue';
import CartModal from './components/CartModal.vue';
import CheckoutModal from './components/CheckoutModal.vue';
import AuthModal from './components/AuthModal.vue';
import RecentlyViewed from './components/RecentlyViewed.vue';

// State
const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const isLoading = ref(true);
const error = ref('');

const searchQuery = ref('');
const selectedCategory = ref('');

const isCartOpen = ref(false);
const isAuthOpen = ref(false);
const selectedProduct = ref<Product | null>(null);
const isProductModalOpen = ref(false);
const isCheckoutOpen = ref(false);

const handleCheckout = () => {
  isCartOpen.value = false;
  isCheckoutOpen.value = true;
};

const handleCheckoutClose = () => {
  isCheckoutOpen.value = false;
};

const handleCheckoutSuccess = () => {
  isCheckoutOpen.value = false;
  cartStore.clearCart();
};
// Stores
const cartStore = useCartStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const viewedStore = useViewedStore();

// Computed
const filteredProducts = computed(() => {
  let result = products.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }
  
  if (selectedCategory.value) {
    result = result.filter(p => p.category === selectedCategory.value);
  }
  
  return result;
});

// Methods
const loadProducts = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    const response = await apiService.getProducts(100);
    products.value = response.products;
  } catch (e) {
    error.value = 'Failed to load products. Please try again.';
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const loadCategories = async () => {
  try {
    categories.value = await apiService.getAllCategories();
  } catch (e) {
    console.error('Failed to load categories:', e);
  }
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const handleCategoryChange = (category: string) => {
  selectedCategory.value = category;
};

const getCategoryEmoji = (category: string): string => {
  const emojis: Record<string, string> = {
    'smartphones': '📱',
    'laptops': '💻',
    'fragrances': '🧴',
    'skincare': '✨',
    'groceries': '🛒',
    'home-decoration': '🏠',
    'furniture': '🛋️',
    'tops': '👕',
    'womens-dresses': '👗',
    'womens-shoes': '👠',
    'mens-shirts': '👔',
    'mens-shoes': '👟',
    'mens-watches': '⌚',
    'womens-watches': '⌚',
    'womens-bags': '👜',
    'womens-jewellery': '💎',
    'sunglasses': '🕶️',
    'automotive': '🚗',
    'motorcycle': '🏍️',
    'lighting': '💡',
  };
  return emojis[category] || '📦';
};

const openProductModal = (product: Product) => {
  selectedProduct.value = product;
  isProductModalOpen.value = true;
  viewedStore.addProduct(product);
};

const closeProductModal = () => {
  isProductModalOpen.value = false;
  selectedProduct.value = null;
};

// Lifecycle
onMounted(async () => {
  cartStore.loadFromLocalStorage();
  await authStore.initAuth();
  themeStore.loadFromLocalStorage();
  viewedStore.loadFromLocalStorage();
  
  await Promise.all([loadProducts(), loadCategories()]);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <NavBar 
      @open-cart="isCartOpen = true" 
      @open-auth="isAuthOpen = true" 
    />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
      <div class="relative mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div class="relative px-8 py-16 md:py-24 text-center">
          <h1 class="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            Welcome to the E-Commerce Online Store
          </h1>
          <p class="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover amazing products at great prices. Shop now for exclusive deals and unbeatable quality!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              @click="selectedCategory = ''"
              class="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Shop Now
            </button>
            <button 
              @click="selectedCategory = 'smartphones'" 
              class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 active:bg-white/20 active:scale-95 transition-all"
            >
              View Deals
            </button>
          </div>
        </div>
      </div>

      <!-- Features / Trust Badges -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Free Shipping</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">On orders over $50</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Secure Payment</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">100% Protected</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Easy Returns</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">30-day return policy</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-700">
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          </div>
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">24/7 Support</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">Dedicated support</p>
        </div>
      </div>

      <!-- Featured Categories -->
      <div class="mb-12">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shop by Category</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <button 
            v-for="category in categories.slice(0, 6)" 
            :key="category.slug"
            @click="selectedCategory = category.slug"
            :class="[
              'p-4 rounded-xl text-center transition-all border-2',
              selectedCategory === category.slug
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 bg-white dark:bg-gray-800'
            ]"
          >
            <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <span class="text-2xl">{{ getCategoryEmoji(category.slug) }}</span>
            </div>
            <h3 class="font-medium text-gray-900 dark:text-white text-sm truncate">{{ category.name }}</h3>
          </button>
        </div>
      </div>

      <!-- Filter Bar -->
      <FilterBar 
        :categories="categories"
        :selected-category="selectedCategory"
        :search-query="searchQuery"
        @update:search-query="handleSearch"
        @update:selected-category="handleCategoryChange"
      />

      <!-- Loading State with Skeleton -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse">
          <div class="h-48 bg-gray-200 dark:bg-gray-700"></div>
          <div class="p-4 space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div class="flex justify-between items-center pt-2">
              <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
        <button 
          @click="loadProducts"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>

      <!-- Products Grid -->
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id"
            :product="product"
            @view-details="openProductModal"
          />
        </div>

        <!-- No Results -->
        <div v-if="filteredProducts.length === 0" class="text-center py-12">
          <p class="text-gray-500 dark:text-gray-400 text-lg">
            No products found matching your criteria
          </p>
        </div>
      </div>

      <!-- Recently Viewed -->
      <RecentlyViewed @view-details="openProductModal" />

      <!-- Newsletter Section -->
      <div class="mt-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">Subscribe to Our Newsletter</h2>
        <p class="text-blue-100 mb-6 max-w-2xl mx-auto">
          Get the latest updates on new products and upcoming sales. No spam, unsubscribe anytime.
        </p>
        <form class="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto" @submit.prevent>
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button 
            type="submit"
            class="px-8 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-blue-50 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Company Info -->
          <div class="col-span-1 md:col-span-2">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">E-Commerce Store</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Your one-stop shop for amazing products at great prices. We deliver quality products directly to your door.
            </p>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-blue-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-pink-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-blue-700 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">About Us</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Contact</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div>
            <h4 class="font-semibold text-gray-900 dark:text-white mb-4">Customer Service</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Help Center</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Shipping Info</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Returns</a></li>
              <li><a href="#" class="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>

        <div class="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            © 2026 E-Commerce Store. All rights reserved. Built with Vue 3, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <ProductModal 
      :product="selectedProduct"
      :is-open="isProductModalOpen"
      @close="closeProductModal"
    />


    <CartModal 
      :is-open="isCartOpen"
      @close="isCartOpen = false"
      @checkout="handleCheckout"
    />

    <CheckoutModal
      :is-open="isCheckoutOpen"
      :total="cartStore.totalPrice"
      @close="handleCheckoutClose"
      @success="handleCheckoutSuccess"
    />

    <AuthModal 
      :is-open="isAuthOpen"
      @close="isAuthOpen = false"
    />
  </div>
</template>