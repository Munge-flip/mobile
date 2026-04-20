<template>
  <div id="service-layout">
    <app-header :nav-links="navLinks" :is-logged-in="isLoggedIn" />

    <div v-if="route.meta.banner" class="banner">
      <img :src="route.meta.banner" :alt="route.meta.title || 'Banner'">
    </div>

    <main class="services-container">
      <aside class="sidebar">
        <service-sidebar 
          v-if="route.meta.gameName"
          :game-icon="route.meta.gameIcon"
          :game-name="route.meta.gameName"
          :custom-instructions="route.meta.customInstructions"
        />
      </aside>

      <section class="content">
        <service-catalog-loader v-if="route.meta.gameName" :game="route.meta.gameName" />
        <router-view />
      </section>
    </main>

    <app-footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import ServiceSidebar from '../components/ServiceSidebar.vue';
import ServiceCatalogLoader from '../components/ServiceCatalogLoader.vue';

const route = useRoute();
const isLoggedIn = computed(() => !!window.User);

const navLinks = computed(() => {
  const links = [
    { label: 'Home', url: '/' }
  ];
  
  if (isLoggedIn.value) {
    links.push({ label: 'Profile', url: '/user' });
    links.push({ label: 'Track Order', url: '/user/order' });
  } else {
    links.push({ label: 'Sign In', url: '/login' });
    links.push({ label: 'Sign Up', url: '/register', class: 'btn-primary' });
  }
  
  return links;
});
</script>

<style scoped>
/* Inherits from services.css */
</style>
