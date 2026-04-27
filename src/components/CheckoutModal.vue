<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getStripe, createPaymentIntent } from '../services/stripe';

const props = defineProps<{
  isOpen: boolean;
  total: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const isProcessing = ref(false);
const isSuccess = ref(false);
const stripeError = ref('');

// Stripe elements
const stripe = ref<any>(null);
const cardMounted = ref(false);

const paymentMethods = [
  { label: 'Credit Card', value: 'card', icon: '💳' },
  { label: 'PayPal', value: 'paypal', icon: '🅿️' },
  { label: 'Apple Pay', value: 'apple', icon: '' },
  { label: 'Google Pay', value: 'google', icon: 'G' },
  { label: 'Cash on Delivery', value: 'cod', icon: '💵' },
];

const form = reactive({
  fullName: '',
  email: '',
  address: '',
  city: '',
  zipCode: '',
  paymentMethod: 'card',
  cardNumber: '',
  cardExpiry: '',
  cardCvv: '',
});

const initStripe = async () => {
  if (cardMounted.value) return;
  
  try {
    const stripeInstance = await getStripe();
    if (stripeInstance) {
      stripe.value = stripeInstance;
      // In production, you'd create a PaymentIntent on your backend
      // and mount Stripe Elements here
      cardMounted.value = true;
    }
  } catch (error) {
    console.error('Stripe initialization error:', error);
    stripeError.value = 'Stripe not configured. Add your API key in src/services/stripe.ts';
  }
};

const handleSubmit = async () => {
  isProcessing.value = true;
  stripeError.value = '';

  try {
    if (form.paymentMethod === 'card') {
      // Real Stripe payment processing
      const stripeInstance = await getStripe();
      
      if (stripeInstance) {
        // In production: Create PaymentIntent on backend
        await createPaymentIntent(Math.round(props.total * 100));
        
        // For demo, simulate successful payment
        // In production: Use stripe.confirmCardPayment with clientSecret
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else {
        // Fallback: Simulate payment if Stripe not configured
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } else if (form.paymentMethod === 'paypal') {
      // Redirect to PayPal (simulated)
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else if (form.paymentMethod === 'cod') {
      // Cash on delivery - no online payment
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      // Other payment methods (simulated)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    isProcessing.value = false;
    isSuccess.value = true;

    setTimeout(() => {
      emit('success');
    }, 1500);
  } catch (error: any) {
    isProcessing.value = false;
    stripeError.value = error.message || 'Payment failed. Please try again.';
  }
};

// Initialize Stripe when card payment is selected
import { watch } from 'vue';
watch(() => form.paymentMethod, (method) => {
  if (method === 'card') {
    initStripe();
  }
});
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden transition-colors border border-gray-200 dark:border-gray-800">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50 shrink-0">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Checkout</h2>
        <button @click="emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto flex-1">
        <!-- Success State -->
        <div v-if="isSuccess" class="text-center py-8 animate-in fade-in zoom-in duration-300">
          <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h3>
          <p class="text-gray-600 dark:text-gray-400">Thank you for your purchase. We've sent a confirmation email to {{ form.email }}.</p>
        </div>

        <!-- Form State -->
        <form v-else @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Stripe Error Message -->
          <div v-if="stripeError" class="p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
            <p class="text-sm text-red-600 dark:text-red-400">{{ stripeError }}</p>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Payment Method</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button 
                v-for="method in paymentMethods" 
                :key="method.value"
                type="button"
                @click="form.paymentMethod = method.value"
                :class="[
                  'flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all',
                  form.paymentMethod === method.value 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                ]"
              >
                <span class="text-2xl mb-1">{{ method.icon }}</span>
                <span class="text-xs font-semibold">{{ method.label }}</span>
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input v-model="form.fullName" required type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="John Doe" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input v-model="form.email" required type="email" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="john@example.com" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Address</label>
              <textarea v-model="form.address" required rows="2" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="123 Street Name"></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                <input v-model="form.city" required type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ZIP Code</label>
                <input v-model="form.zipCode" required type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          <template v-if="form.paymentMethod === 'card'">
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mt-6 mb-4">Card Details</h4>
            <div class="grid grid-cols-1 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                <input
                  v-model="form.cardNumber"
                  :required="form.paymentMethod === 'card'"
                  type="text"
                  pattern="[0-9]{13,16}"
                  title="Card number must be 13-16 digits"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="XXXX XXXX XXXX XXXX"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date (MM/YY)</label>
                  <input v-model="form.cardExpiry" :required="form.paymentMethod === 'card'" type="text" pattern="(0[1-9]|1[0-2])\/?([0-9]{2})" title="MM/YY format" placeholder="MM/YY" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                  <input v-model="form.cardCvv" :required="form.paymentMethod === 'card'" type="text" pattern="[0-9]{3,4}" title="CVV must be 3 or 4 digits" maxlength="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="form.paymentMethod === 'paypal'">
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mt-6 mb-4">PayPal</h4>
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-200">
              You will be redirected to PayPal for payment (simulated).
            </div>
          </template>
          <template v-else-if="form.paymentMethod === 'apple'">
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mt-6 mb-4">Apple Pay</h4>
            <div class="p-4 bg-black rounded-lg text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-900 transition-colors">
              <span class="text-xl"></span> Pay
            </div>
          </template>
          <template v-else-if="form.paymentMethod === 'google'">
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mt-6 mb-4">Google Pay</h4>
            <div class="p-4 bg-white border border-gray-300 rounded-lg text-gray-900 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 transition-colors">
              <span class="font-bold text-blue-600 text-lg">G</span> Pay
            </div>
          </template>
          <template v-else-if="form.paymentMethod === 'cod'">
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mt-6 mb-4">Cash on Delivery</h4>
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-700 dark:text-green-200">
              Pay with cash upon delivery. No online payment required.
            </div>
          </template>

          <!-- Order Summary Small -->
          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-center text-gray-900 dark:text-white font-bold">
              <span>Total Amount</span>
              <span class="text-xl text-blue-600 dark:text-blue-400">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="mt-8 flex flex-col gap-3">
            <button 
              type="submit" 
              :disabled="isProcessing"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <svg v-if="isProcessing" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isProcessing ? 'Processing Payment...' : 'Confirm Order' }}
            </button>
            <button 
              type="button"
              @click="emit('close')"
              class="w-full py-3 px-4 bg-transparent text-gray-500 dark:text-gray-400 font-medium hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes zoom-in {
  from { transform: scale(0.95); }
  to { transform: scale(1); }
}
.animate-in {
  animation: fade-in 0.3s ease-out, zoom-in 0.3s ease-out;
}
</style>