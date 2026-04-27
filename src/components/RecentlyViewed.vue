<template>
  <section v-if="viewedStore.items.length > 0" class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Recently Viewed</h2>
      <button @click="viewedStore.items = []" class="text-sm text-gray-500 hover:text-red-500 transition-colors">
        Clear History
      </button>
    </div>
    
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
      <div 
        v-for="item in viewedStore.items" 
        :key="item.id" 
        class="group cursor-pointer" 
        @click="$emit('viewDetails', item)"
      >
        <div class="relative aspect-square overflow-hidden rounded-lg mb-2 shadow-sm border border-gray-100 dark:border-gray-700">
          <img :src="item.thumbnail" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
        </div>
        <p class="text-[10px] uppercase font-bold text-blue-500 mb-0.5 truncate">{{ item.category }}</p>
        <p class="text-xs truncate font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">{{ item.title }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useViewedStore } from '../types/viewed';
const viewedStore = useViewedStore();
defineEmits(['viewDetails']);
</script>