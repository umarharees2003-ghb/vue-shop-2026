<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import { useCartStore } from '../stores/cart';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const cartStore = useCartStore();

const closeModal = () => {
  emit('close');
};

// Accessibility: Close on escape and prevent body scroll
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal();
};

watch(() => props.isOpen, (active) => {
  if (active) {
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
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
        <div class="absolute inset-0 bg-black bg-opacity-50 transition-opacity" @click="closeModal"></div>
        <div class="absolute inset-y-0 right-0 max-w-full flex">
          <div class="w-screen max-w-md">
            <div class="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
              <div class="flex items-center justify-between px-4 py-6 border-b border-gray-200 dark:border-gray-700 sm:px-6">
                <h2 class="text-lg font-medium text-gray-900 dark:text-white">Shopping Cart</h2>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-500 transition-colors">
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div v-if="cartStore.items.length === 0" class="text-center py-12">
                  <p class="text-gray-500 dark:text-gray-400">Your cart is empty</p>
                </div>
                <ul v-else class="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                  <li v-for="item in cartStore.items" :key="item.product.id" class="py-6 flex">
                    <div class="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                      <img :src="item.product.thumbnail" :alt="item.product.title" class="w-full h-full object-center object-cover" />
                    </div>
                    <div class="ml-4 flex-1 flex flex-col">
                      <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                        <h3>{{ item.product.title }}</h3>
                        <p class="ml-4">${{ (item.product.price * item.quantity).toFixed(2) }}</p>
                      </div>
                      <div class="flex-1 flex items-end justify-between text-sm">
                        <div class="flex items-center gap-2">
                          <button @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)" class="px-2 border rounded dark:border-gray-600 dark:text-white">-</button>
                          <span class="dark:text-white">{{ item.quantity }}</span>
                          <button @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)" class="px-2 border rounded dark:border-gray-600 dark:text-white">+</button>
                        </div>
                        <button @click="cartStore.removeItem(item.product.id)" class="font-medium text-red-600 hover:text-red-500">Remove</button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6">
                <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                  <p>Subtotal</p>
                  <p>${{ cartStore.totalPrice.toFixed(2) }}</p>
                </div>
                <div class="mt-6">
                  <button class="w-full flex justify-center items-center px-6 py-3 rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">Checkout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease-in-out; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .w-screen, .modal-leave-active .w-screen { transition: transform 0.3s ease-in-out; }
.modal-enter-from .w-screen, .modal-leave-to .w-screen { transform: translateX(100%); }
</style>