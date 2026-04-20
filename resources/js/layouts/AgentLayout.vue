<template>
  <div id="agent-layout">
    <app-header 
      :is-logged-in="true" 
      role-info="Agent Panel"
      :nav-links="navLinks"
    />

    <main class="dashboard-container">
      <app-sidebar :menu-items="agentMenu" />

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
  { label: 'Profile', url: '/agent', exact: true }
];

const agentMenu = [
  { 
    label: 'My Account', 
    route: '/agent', 
    exact: true,
    includes: ['/agent/edit', '/agent/update'],
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>' 
  },
  { 
    label: 'Orders Handling', 
    route: '/agent/order', 
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path></svg>' 
  }
];
</script>

<style scoped>
/* Scoped styles if needed */
</style>
