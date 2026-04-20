<template>
  <div id="user-layout">
    <app-header 
      :is-logged-in="true" 
      :nav-links="navLinks"
    />

    <main class="profile-container">
      <app-sidebar :menu-items="userMenu" />

      <section class="content">
        <router-view />
      </section>
    </main>

    <app-footer />
  </div>
</template>

<script setup>
const navLinks = [
  { label: 'Home', url: '/' },
  { label: 'Profile', url: '/user', exact: true },
  { label: 'Track Order', url: '/user/order' }
];

const userMenu = [
  { 
    label: 'My Account', 
    route: '/user', 
    exact: true,
    includes: ['/user/edit', '/user/update'],
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' 
  },
  { 
    label: 'Order History', 
    route: '/user/order', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>' 
  },
  { 
    label: 'Transactions', 
    route: '/user/transactions', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>' 
  }
];
</script>

<style scoped>
/* Scoped styles if needed */
</style>
