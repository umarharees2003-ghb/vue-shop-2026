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

const isRegisterMode = ref(false);
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    error.value = 'Please enter email and password';
    return;
  }

  isLoading.value = true;
  error.value = '';

  const success = await authStore.login(email.value, password.value);
  
  isLoading.value = false;

  if (success) {
    emit('close');
  } else {
    error.value = 'Invalid email or password';
  }
};

const handleRegister = async () => {
  if (!email.value || !password.value || !firstName.value || !lastName.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  isLoading.value = true;
  error.value = '';

  const success = await authStore.register(email.value, password.value, firstName.value, lastName.value);
  
  isLoading.value = false;

  if (success) {
    emit('close');
  } else {
    error.value = 'Registration failed. Email may already be in use.';
  }
};

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
  error.value = '';
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
    email.value = '';
    password.value = '';
    firstName.value = '';
    lastName.value = '';
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
              {{ isRegisterMode ? 'Create Account' : 'Welcome Back' }}
            </h2>
            <p class="text-gray-500 dark:text-gray-400 mt-2">
              {{ isRegisterMode ? 'Sign up for a new account' : 'Sign in to your account' }}
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
          </div>

          <!-- Login Form -->
          <form v-if="!isRegisterMode" @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                v-model="email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
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

          <!-- Register Form -->
          <form v-else @submit.prevent="handleRegister" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  v-model="firstName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  v-model="lastName"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                v-model="email"
                type="email"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email"
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
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              :disabled="isLoading"
              class="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </button>
          </form>

          <!-- Toggle Mode -->
          <div class="mt-4 text-center">
            <p class="text-gray-600 dark:text-gray-400">
              {{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
              <button type="button" @click="toggleMode" class="text-blue-600 hover:text-blue-700 font-medium ml-1">
                {{ isRegisterMode ? 'Sign In' : 'Sign Up' }}
              </button>
            </p>
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
</style>