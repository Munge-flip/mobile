<template>
  <div class="service-category">
    <h3>{{ title }}</h3>
    <p v-if="description" class="category-description">{{ description }}</p>
    
    <div :class="[customLayout ? '' : 'service-options']">
      <!-- DYNAMIC API CONTENT -->
      <template v-if="apiCategory">
        <service-button 
          v-for="service in filteredServices" 
          :key="service.id"
          :category="service.category" 
          :service="service.slug" 
          :price="Number(service.price)" 
          :label="service.name" 
        ></service-button>
        <p v-if="filteredServices.length === 0 && !serviceStore.loading" class="text-muted">
          No services available in this category.
        </p>
      </template>

      <!-- STATIC SLOT CONTENT (Fallback) -->
      <slot v-else></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { serviceStore } from '../stores/serviceStore';

const props = defineProps({
  title: String,
  description: String,
  customLayout: Boolean,
  apiCategory: String // The category name from the Database
});

const filteredServices = computed(() => {
  if (!props.apiCategory) return [];
  return serviceStore.allServices.filter(s => s.category_name === props.apiCategory);
});
</script>

<style scoped>
/* Core styles are inherited from services.css */
.category-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 15px;
    font-style: italic;
}
.text-muted {
    font-size: 13px;
    color: #888;
    font-style: italic;
}
</style>