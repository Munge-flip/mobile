<template>
  <div class="content-section active">
    <admin-dashboard-overview 
      v-if="stats"
      :initial-stats="stats"
      :initial-orders="recentOrders"
      :initial-transactions="recentTransactions"
      api-url="/api/v1/admin/stats"
    ></admin-dashboard-overview>
    <div v-else class="text-center p-10">
      <p>Loading dashboard data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AdminDashboardOverview from '../../components/AdminDashboardOverview.vue';

const stats = ref(null);
const recentOrders = ref([]);
const recentTransactions = ref([]);

async function fetchDashboardData() {
  try {
    const response = await axios.get('/api/v1/admin/stats');
    if (response.data.success) {
      stats.value = response.data.stats;
      recentOrders.value = response.data.recentOrders;
      recentTransactions.value = response.data.recentTransactions;
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
  }
}

onMounted(fetchDashboardData);
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
