<template>
  <div class="orders-container">
    <!-- Search Bar -->
    <div class="section-header" style="margin-bottom: 25px;">
      <div style="position: relative; width: 100%; max-width: 400px;">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search by ID, Game, or Service..." 
          class="search-input"
          style="width: 100%; padding-left: 45px;"
        >
        <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); opacity: 0.5;">🔍</span>
      </div>
      
      <div v-if="searchQuery" class="text-muted" style="margin-top: 10px; font-size: 13px;">
        Found {{ pagination.total }} result(s) for "{{ searchQuery }}"
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center p-10">
      <p>Fetching orders...</p>
    </div>

    <!-- Orders List -->
    <template v-else>
      <div v-for="order in orders" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-id">
            <strong>Order #{{ order.id }}</strong>
            <span class="order-date">{{ formatDate(order.created_at) }}</span>
          </div>
          <status-badge :status="order.status"></status-badge>
        </div>

        <div class="order-details">
          <detail-row label="Game" :value="order.game"></detail-row>
          <detail-row label="Service" :value="order.service_type"></detail-row>
          <detail-row :label="isAgent ? 'Customer' : 'Amount'">
            <span v-if="!isAgent" class="price">₱{{ formatPrice(order.price) }}</span>
            <span v-else>{{ order.user?.name || 'Unknown' }}</span>
          </detail-row>
        </div>

        <div class="order-actions">
          <router-link :to="`${viewBaseUrl}/${order.id}`" class="action-btn primary">View</router-link>
          <router-link :to="`${viewBaseUrl}/${order.id}/chat`" class="action-btn secondary">
            Chat with {{ isAgent ? 'User' : 'Agent' }}
          </router-link>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0" class="order-card" style="text-align: center; color: #888;">
        <p v-if="searchQuery">No orders matching "{{ searchQuery }}"</p>
        <p v-else>No orders found. <router-link v-if="!isAgent" to="/" style="color: #667eea;">Book a service now!</router-link></p>
      </div>

      <!-- Pagination Controls -->
      <div v-if="pagination.last_page > 1" class="pagination-wrapper">
        <nav class="pagination">
          <button 
            @click="changePage(pagination.current_page - 1)" 
            :disabled="pagination.current_page === 1"
            class="btn-secondary btn-sm"
          >
            Previous
          </button>
          
          <span class="p-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>

          <button 
            @click="changePage(pagination.current_page + 1)" 
            :disabled="pagination.current_page === pagination.last_page"
            class="btn-secondary btn-sm"
          >
            Next
          </button>
        </nav>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue';
import axios from 'axios';
import StatusBadge from './StatusBadge.vue';
import DetailRow from './DetailRow.vue';

const props = defineProps({
  apiUrl: { type: String, required: true },
  viewBaseUrl: { type: String, default: '/user/order' },
  isAgent: { type: Boolean, default: false }
});

const orders = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0
});
let searchTimeout = null;
let pollInterval = null;

async function fetchOrders(page = 1, showLoading = true) {
  if (showLoading) loading.value = true;
  try {
    const response = await axios.get(props.apiUrl, {
      params: { 
        search: searchQuery.value,
        page: page 
      }
    });
    if (response.data.success) {
      orders.value = response.data.data;
      pagination.current_page = response.data.meta.current_page;
      pagination.last_page = response.data.meta.last_page;
      pagination.total = response.data.meta.total;
    }
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  } finally {
    if (showLoading) loading.value = false;
  }
}

function changePage(page) {
  if (page >= 1 && page <= pagination.last_page) {
    fetchOrders(page);
  }
}

// Debounced Search Logic
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchOrders(1);
  }, 300);
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatPrice(val) {
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
}

onMounted(() => {
  fetchOrders(1);
  // Refresh every 30 seconds silently if on page 1
  pollInterval = setInterval(() => {
    if (!searchQuery.value && pagination.current_page === 1) {
      fetchOrders(1, false);
    }
  }, 30000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
.order-card {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.search-input {
    transition: all 0.3s ease;
}
.search-input:focus {
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    transform: scale(1.02);
}
.pagination-wrapper {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 15px;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
