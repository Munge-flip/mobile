<template>
  <div class="content-section">
    <h1>My Transactions</h1>

    <div class="orders-container">
      <div v-if="loading" class="text-center p-10">
        <p>Loading transactions...</p>
      </div>

      <template v-else>
        <div v-for="t in transactions" :key="t.id" class="order-card">
          <div class="order-header">
            <div class="order-id">
              <strong>Transaction #{{ t.id }}</strong>
              <span class="order-date">{{ formatDate(t.created_at) }}</span>
            </div>
            <status-badge :status="t.status"></status-badge>
          </div>

          <div class="order-details">
            <detail-row label="Order">
              <router-link :to="`/user/order/${t.order_id}`" style="color: #667eea; text-decoration: underline;">
                Order #{{ t.order_id }}
              </router-link>
            </detail-row>
            <detail-row label="Amount" :value="t.amount" :is-price="true"></detail-row>
            <detail-row label="Payment Method" :value="t.payment_method" value-class="text-uppercase"></detail-row>
            <detail-row label="Reference" :value="t.transaction_reference || 'N/A'"></detail-row>
          </div>

          <div class="order-actions">
            <router-link :to="`/user/transactions/${t.id}`" class="action-btn primary">
              View Details
            </router-link>
          </div>
        </div>

        <div v-if="transactions.length === 0" class="order-card" style="text-align: center; color: #888;">
          <p>No transactions found.</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import StatusBadge from '../../components/StatusBadge.vue';
import DetailRow from '../../components/DetailRow.vue';

const transactions = ref([]);
const loading = ref(true);

async function fetchTransactions() {
  try {
    const response = await axios.get('/api/v1/user/transactions');
    if (response.data.success) {
      // The API currently doesn't use the 'data' envelope consistently
      // Let's check how userTransactions returns data
      transactions.value = response.data.data || response.data;
    }
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

onMounted(fetchTransactions);
</script>

<style scoped>
.text-uppercase { text-transform: uppercase; }
</style>
