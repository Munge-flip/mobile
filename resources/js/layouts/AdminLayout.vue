<template>
  <div id="admin-layout">
    <app-header 
      :is-logged-in="true" 
      role-info="Admin Panel"
      :nav-links="navLinks"
    />

    <main class="dashboard-container">
      <app-sidebar :menu-items="adminMenu" />

      <section class="content">
        <router-view />
      </section>
    </main>

    <app-footer />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const navLinks = [
  { label: 'Home', url: '/' },
  { label: 'Profile', url: '/admin/profile', exact: true }
];

const adminMenu = [
  { 
    label: 'Overview', 
    route: '/admin', 
    exact: true,
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>' 
  },
  { 
    label: 'Orders', 
    route: '/admin/order', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>' 
  },
  { 
    label: 'Transactions', 
    route: '/admin/transactions', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>' 
  },
  { 
    label: 'Services', 
    route: '/admin/services', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>' 
  },
  { 
    label: 'Agents', 
    route: '/admin/agent', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>' 
  },
  { 
    label: 'Users', 
    route: '/admin/user', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' 
  }
];
</script>

<style scoped>
/* Scoped styles if needed */
</style>
