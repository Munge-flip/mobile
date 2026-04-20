<template>
  <div class="agent-card">
    <div class="agent-header">
      <div class="agent-avatar">
        {{ getInitials(name) }}
      </div>
      <div class="agent-info">
        <h3>{{ name }}</h3>
        <span class="agent-id">ID: #{{ id }}</span>
      </div>
      <div class="agent-status">
        <span class="stat-badge">{{ status }}</span>
      </div>
    </div>

    <div class="agent-details">
      <div class="detail-item">
        <span>Active Orders:</span>
        <strong>{{ activeOrders }}</strong>
      </div>
      <div class="detail-item">
        <span>Completed:</span>
        <strong>{{ completedOrders }}</strong>
      </div>
    </div>

    <div class="agent-actions">
      <router-link v-if="ordersRoute" :to="ordersRoute" class="btn-secondary">
        View Orders
      </router-link>
      <router-link v-if="manageRoute" :to="manageRoute" class="btn-danger">
        Manage Agent
      </router-link>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: [Number, String],
  name: String,
  status: { type: String, default: 'Active' },
  activeOrders: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  ordersRoute: String,
  manageRoute: String
});

function getInitials(name) {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}
</script>

<style scoped>
/* Inherits from dashboard.css */
</style>
