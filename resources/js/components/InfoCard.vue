<template>
  <div class="info-card">
    <div class="card-header">
      <slot name="header">
        <h3 v-if="title">{{ title }}</h3>
      </slot>
      <slot name="action">
        <router-link v-if="manageRoute" :to="manageRoute" class="edit-btn">Manage →</router-link>
      </slot>
    </div>
    
    <div :class="{ 'card-body': useBody }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  manageRoute: String,
  useBody: { type: Boolean, default: false }
});
</script>

<style scoped>
/* Core styles inherited from app.css */
</style>
