<script setup lang="ts">
const props = defineProps<{
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
}>();

const emit = defineEmits<{
  (e: 'update:search-query', value: string): void;
  (e: 'update:selected-category', value: string): void;
}>();

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:search-query', target.value);
};

const handleCategorySelect = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:selected-category', target.value);
};
</script>

<template>
  <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm mb-8 flex flex-col sm:flex-row gap-4 transition-colors">
    <div class="flex-grow relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      <input
        :value="searchQuery"
        @input="handleSearchInput"
        type="text"
        placeholder="Search products..."
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors sm:text-sm"
      />
    </div>

    <div class="sm:w-64">
      <select
        :value="selectedCategory"
        @change="handleCategorySelect"
        class="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors sm:text-sm appearance-none cursor-pointer"
      >
        <option value="">All Categories</option>
        <option v-for="category in categories" :key="category" :value="category" class="capitalize">
          {{ category }}
        </option>
      </select>
    </div>

    <button 
      v-if="searchQuery || selectedCategory"
      @click="emit('update:search-query', ''); emit('update:selected-category', '')"
      class="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-center whitespace-nowrap"
    >
      Clear Filters
    </button>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
}
</style>