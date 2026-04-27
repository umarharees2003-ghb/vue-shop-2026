<template>
  <div class="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
    <!-- Image Container with Hover Quick View -->
    <div class="relative aspect-square overflow-hidden cursor-pointer" @click="$emit('viewDetails', product)">
      <img 
        :src="product.thumbnail" 
        :alt="product.title" 
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      
      <!-- Quick View Overlay -->
      <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button 
          @click.stop="$emit('viewDetails', product)"
          class="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-blue-600 hover:text-white"
        >
          Quick View
        </button>
      </div>
      
      <!-- Discount Badge -->
      <div v-if="product.discountPercentage > 10" class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </div>

    <div class="p-4">
      <div class="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 uppercase tracking-tighter">
        {{ product.category }}
      </div>

      <h3 
        class="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
        @click="$emit('viewDetails', product)"
      >
        {{ product.title }}
      </h3>
      
      <!-- Stars and Rating -->
      <div class="flex items-center mb-2">
        <div class="flex items-center">
          <svg v-for="i in 5" :key="i" 
            class="w-4 h-4" 
            :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'"
            fill="currentColor" viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <span class="ml-2 text-sm text-gray-500 dark:text-gray-400">{{ product.rating.toFixed(1) }}</span>
      </div>

      <div class="flex items-center justify-between mt-4">
        <div>
          <span class="text-2xl font-bold text-gray-900 dark:text-white">${{ product.price }}</span>
          <span v-if="product.discountPercentage > 0" class="ml-2 text-sm text-gray-500 line-through">
            ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
          </span>
        </div>
        <button 
          @click="cartStore.addItem(product)"
          class="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          aria-label="Add to cart"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types';
import { useCartStore } from '../stores/cart';
const props = defineProps<{ product: Product }>();
defineEmits(['viewDetails']);
const cartStore = useCartStore();
</script>