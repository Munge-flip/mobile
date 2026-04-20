<template>
  <aside class="sidebar">
    <div class="sidebar-menu">
      <router-link 
        v-for="item in menuItems" 
        :key="item.route" 
        :to="item.route"
        class="menu-btn"
        :class="{ 'active': isLinkActive(item) }"
      >
        <span v-html="item.icon"></span>
        {{ item.label }}
      </router-link>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';

const props = defineProps({
  menuItems: {
    type: Array,
    required: true,
  }
});

const route = useRoute();

function isLinkActive(item) {
  if (item.exact) {
    // Check for exact match OR if current path is in the includes array
    if (route.path === item.route) return true;
    if (item.includes && Array.isArray(item.includes)) {
      return item.includes.includes(route.path);
    }
    return false;
  }
  // Standard prefix matching for items like /user/order matching /user/order/31
  return route.path.startsWith(item.route);
}
</script>

<style scoped>
/* Inherits from dashboard.css */
</style>
