<template>
  <div id="public-layout">
    <main>
      <app-header :nav-links="navLinks" />
      <router-view />
    </main>
    <app-footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { authStore } from '../stores/authStore';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

// In a real SPA, we would get this from a UserStore
const navLinks = computed(() => {
  const links = [
    { label: 'Home', url: '/' }
  ];
  
  if (authStore.user) {
    links.push({ label: 'Profile', url: '/user', exact: true });
    links.push({ label: 'Track Order', url: '/user/order' });
  } else {
    links.push({ label: 'Sign In', url: '/login' });
    links.push({ label: 'Sign Up', url: '/register', class: 'btn-primary' });
  }
  
  return links;
});
</script>

<style scoped>
/* Scoped styles if needed */
</style>
