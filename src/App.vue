<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import type { Product, Category } from './types';
import apiService from './services/api';
import { useCartStore } from './stores/cart';
import { useAuthStore } from './stores/auth';
import { useThemeStore } from './stores/theme';

// Components
import NavBar from './components/NavBar.vue';
import ProductCard from './components/ProductCard.vue';
import FilterBar from './components/FilterBar.vue';
import ProductModal from './components/ProductModal.vue';
import CartModal from './components/CartModal.vue';
import AuthModal from './components/AuthModal.vue';

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

// Stores
const cartStore = useCartStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();

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

const openProductModal = (product: Product) => {
  selectedProduct.value = product;
  isProductModalOpen.value = true;
};

const closeProductModal = () => {
  isProductModalOpen.value = false;
  selectedProduct.value = null;
};

// Lifecycle
onMounted(async () => {
  cartStore.loadFromLocalStorage();
  await authStore.loadFromLocalStorage();
  themeStore.loadFromLocalStorage();
  
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
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to VueShop
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300">
          Discover amazing products at great prices
        </p>
      </div>

      <!-- Filter Bar -->
      <FilterBar 
        :categories="categories"
        :selected-category="selectedCategory"
        :search-query="searchQuery"
        @update:search-query="handleSearch"
        @update:selected-category="handleCategoryChange"
      />

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    </main>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p class="text-center text-gray-500 dark:text-gray-400">
          © 2026 VueShop. Built with Vue 3, TypeScript & Tailwind CSS.
        </p>
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
    />

    <AuthModal 
      :is-open="isAuthOpen"
      @close="isAuthOpen = false"
    />
  </div>
</template>