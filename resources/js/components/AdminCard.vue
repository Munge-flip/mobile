<template>
  <div class="admin-card">
    <div v-if="title || $slots.header" class="card-header">
      <div v-if="$slots.header" style="flex: 1;">
        <slot name="header"></slot>
      </div>
      <h3 v-else>{{ title }}</h3>
      
      <slot name="action"></slot>
    </div>
    
    <div :class="{'card-body': useBody}">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  useBody: {
    type: Boolean,
    default: true
  }
});
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>