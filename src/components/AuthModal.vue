<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const authStore = useAuthStore();

const username = ref('kminchelle');
const password = ref('0lelplR');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter username and password';
    return;
  }

  isLoading.value = true;
  error.value = '';

  const success = await authStore.login(username.value, password.value);
  
  isLoading.value = false;

  if (success) {
    emit('close');
  } else {
    error.value = 'Invalid credentials. Try: kminchelle / 0lelplR';
  }
};

const closeModal = () => {
  emit('close');
};

// Accessibility and Form Reset
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal();
};

watch(() => props.isOpen, (active) => {
  if (active) {
    // Reset form state on open
    error.value = '';
    isLoading.value = false;
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
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="closeModal"
        ></div>

        <!-- Modal Content -->
        <div class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="text-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome Back
            </h2>
            <p class="text-gray-500 dark:text-gray-400 mt-2">
              Sign in to your account
            </p>
          </div>

          <!-- Demo Credentials -->
          <div class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <p class="text-sm text-blue-600 dark:text-blue-400 font-medium">Demo Credentials</p>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Username: <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">kminchelle</code>
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Password: <code class="bg-gray-100 dark:bg-gray-700 px-1 rounded">0lelplR</code>
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                v-model="username"
                type="text"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                v-model="password"
                type="password"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {{ isLoading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
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
</style>