<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import type { Product } from '../types';
import { useCartStore } from '../stores/cart';

const props = defineProps<{
  product: Product | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const cartStore = useCartStore();

const addToCart = () => {
  if (props.product) {
    cartStore.addItem(props.product);
  }
};

const closeModal = () => {
  emit('close');
};

// Close on escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    closeModal();
  }
};

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    window.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
  } else {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'auto';
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = 'auto';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && product" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="closeModal"
        ></div>

        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Product Images -->
          <div class="aspect-video relative overflow-hidden rounded-t-2xl">
            <img 
              :src="(product.images && product.images.length > 0) ? product.images[0] : product.thumbnail" 
              :alt="product.title"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Product Details -->
          <div class="p-6">
            <div class="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
              {{ product.category }}
            </div>
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {{ product.title }}
            </h2>

            <!-- Rating -->
            <div class="flex items-center mb-4">
              <div class="flex items-center">
                <svg 
                  v-for="i in 5" 
                  :key="i"
                  class="w-5 h-5" 
                  :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'"
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <span class="ml-2 text-gray-500 dark:text-gray-400">
                {{ product.rating.toFixed(1) }} ({{ product.stock }} in stock)
              </span>
            </div>

            <!-- Description -->
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {{ product.description }}
            </p>

            <!-- Brand -->
            <div class="mb-6">
              <span class="text-sm text-gray-500 dark:text-gray-400">Brand: </span>
              <span class="text-gray-900 dark:text-white font-medium">{{ product.brand }}</span>
            </div>

            <!-- Price and Actions -->
            <div class="flex items-center justify-between mt-8 sticky bottom-0 bg-white dark:bg-gray-800 py-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <span class="text-3xl font-bold text-gray-900 dark:text-white">
                  ${{ product.price }}
                </span>
                <span 
                  v-if="product.discountPercentage > 0"
                  class="ml-3 text-lg text-gray-500 line-through"
                >
                  ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
                </span>
                <span 
                  v-if="product.discountPercentage > 0"
                  class="ml-2 text-sm text-green-600 dark:text-green-400"
                >
                  -{{ product.discountPercentage.toFixed(0) }}%
                </span>
              </div>
              <button
                @click="addToCart"
                class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>