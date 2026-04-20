<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Order Chat</h1>
      <router-link :to="`/agent/order/${route.params.id}`" class="btn-secondary">
        ← Back to Order
      </router-link>
    </div>

    <div v-if="loading" class="text-center p-10">
      <p>Loading chat...</p>
    </div>

    <template v-else-if="order">
      <info-card :title="`Chat for Order #${order.id} - ${order.game}`" :use-body="true">
        <chat-box 
          :order-id="order.id"
          :current-user-id="authStore.user.id"
          :api-url="`/api/v1/agent/orders/${order.id}`"
        ></chat-box>
      </info-card>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { authStore } from '../../stores/authStore';
import ChatBox from '../../components/ChatBox.vue';
import InfoCard from '../../components/InfoCard.vue';

const route = useRoute();
const order = ref(null);
const loading = ref(true);

async function fetchOrder() {
  try {
    const response = await axios.get(`/api/v1/agent/orders/${route.params.id}`);
    if (response.data.success) {
      order.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch order for chat:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchOrder);
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
