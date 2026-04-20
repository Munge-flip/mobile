<template>
  <div class="content-section">
    <div v-if="loading" class="text-center p-10">
      <p>Loading order details...</p>
    </div>

    <admin-order-details 
      v-else-if="order"
      :initial-order="order"
      :agents="agents"
      api-url="/api/v1/admin/orders"
    ></admin-order-details>
    
    <div v-else class="text-center p-10">
      <p>Order not found.</p>
      <router-link to="/admin/order" class="btn-secondary">Back to Orders</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import AdminOrderDetails from '../../components/AdminOrderDetails.vue';

const route = useRoute();
const order = ref(null);
const agents = ref([]);
const loading = ref(true);

async function fetchOrderData() {
  try {
    const response = await axios.get(`/api/v1/admin/orders/${route.params.id}`);
    if (response.data.success) {
      order.value = response.data.data.order;
      agents.value = response.data.data.agents;
    }
  } catch (error) {
    console.error('Failed to fetch order:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchOrderData);
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
