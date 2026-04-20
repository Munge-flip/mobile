<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Transaction Management</h1>
      <div style="position: relative; width: 300px;">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search ref or customer..." 
          class="search-input"
          style="width: 100%;"
        >
      </div>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Reference</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="empty-state-row">
            <td colspan="9">Loading transactions...</td>
          </tr>
          <template v-else>
            <tr v-for="t in transactions" :key="t.id">
              <td>#{{ t.id }}</td>
              <td>
                <router-link :to="`/admin/order/${t.order_id}`" style="color: #667eea; text-decoration: underline;">
                  #{{ t.order_id }}
                </router-link>
              </td>
              <td>{{ t.user?.name || 'Unknown' }}</td>
              <td>₱{{ formatPrice(t.amount) }}</td>
              <td class="text-uppercase">{{ t.payment_method }}</td>
              <td>{{ t.transaction_reference || 'N/A' }}</td>
              <td>
                <status-badge :status="t.status"></status-badge>
              </td>
              <td>{{ formatDate(t.created_at) }}</td>
              <td>
                <router-link :to="`/admin/transactions/${t.id}`" class="action-link">View Details</router-link>
              </td>
            </tr>
            <tr v-if="transactions.length === 0" class="empty-state-row">
              <td colspan="9">No transactions found.</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination-wrapper">
      <nav class="pagination">
        <button 
          @click="changePage(pagination.current_page - 1)" 
          :disabled="pagination.current_page === 1"
          class="btn-secondary btn-sm mr-2"
        >
          Previous
        </button>
        <span class="p-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button 
          @click="changePage(pagination.current_page + 1)" 
          :disabled="pagination.current_page === pagination.last_page"
          class="btn-secondary btn-sm ml-2"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  apiUrl: { type: String, required: true }
});

const transactions = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
});
let searchTimeout = null;
let pollInterval = null;

async function fetchTransactions(page = 1, showLoading = true) {
  if (showLoading) loading.value = true;
  try {
    const response = await axios.get(props.apiUrl, {
      params: { 
        search: searchQuery.value,
        page: page 
      }
    });
    if (response.data.success) {
      transactions.value = response.data.data;
      pagination.value = response.data.meta;
    }
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
  } finally {
    if (showLoading) loading.value = false;
  }
}

function startPolling() {
  // Refresh data every 30 seconds
  pollInterval = setInterval(() => {
    // Only auto-refresh if we are on page 1 and not searching
    if (pagination.value.current_page === 1 && !searchQuery.value) {
      fetchTransactions(1, false); // false = silent refresh without spinner
    }
  }, 30000);
}

function changePage(page) {
  if (page >= 1 && page <= pagination.value.last_page) {
    fetchTransactions(page);
  }
}

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchTransactions(1);
  }, 300);
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatPrice(val) {
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
}

onMounted(() => {
  fetchTransactions();
  startPolling();
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.text-uppercase { text-transform: uppercase; }
.mr-2 { margin-right: 0.5rem; }
.ml-2 { margin-left: 0.5rem; }
.pagination { display: flex; align-items: center; justify-content: center; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
