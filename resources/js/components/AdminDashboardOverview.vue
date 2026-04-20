<template>
  <div class="content-section active">
    <div class="section-header">
      <h1>Dashboard Overview</h1>
      <button @click="refreshStats" class="btn-secondary" :disabled="loading">
        <span v-if="loading">Refreshing...</span>
        <span v-else>🔄 Refresh Data</span>
      </button>
    </div>

    <!-- MAIN STATS -->
    <div class="stats-grid">
      <stat-card title="Total Orders" :number="stats.totalOrders" trend="All time" :is-trend-up="true" icon-class="orders-icon">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
          </svg>
        </template>
      </stat-card>

      <stat-card title="Active Agents" :number="stats.activeAgents" trend="Registered agents" icon-class="agents-icon">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </template>
      </stat-card>

      <stat-card title="Total Users" :number="stats.totalUsers" trend="Registered customers" :is-trend-up="true" icon-class="users-icon">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </template>
      </stat-card>

      <stat-card title="Revenue" :number="stats.revenue" trend="Total earnings" :is-trend-up="true" :is-currency="true" icon-class="revenue-icon">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </template>
      </stat-card>
    </div>

    <!-- TRANSACTION STATS -->
    <div class="stats-grid" style="margin-top: 20px;">
      <stat-card title="Pending Verifications" :number="stats.pendingTransactions" trend="Awaiting review" icon-color="linear-gradient(135deg, #f39c12 0%, #e67e22 100%)">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </template>
      </stat-card>

      <stat-card title="Verified Transactions" :number="stats.verifiedTransactions" trend="Approved payments" :is-trend-up="true" icon-color="linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </template>
      </stat-card>

      <stat-card title="Total Transactions" :number="stats.totalTransactions" trend="All time" icon-color="linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)">
        <template #icon>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
            <line x1="2" y1="10" x2="22" y2="10"></line>
          </svg>
        </template>
      </stat-card>
    </div>

    <!-- ACTIVITY TABS -->
    <div style="margin-top: 30px;">
      <div style="display: flex; gap: 10px; border-bottom: 2px solid #e0e0e0; margin-bottom: 20px;">
        <button 
          @click="activeTab = 'orders'"
          :class="['tab-btn', { 'active': activeTab === 'orders' }]"
          :style="activeTab === 'orders' ? activeTabStyle : inactiveTabStyle"
        >
          Recent Orders
        </button>
        <button 
          @click="activeTab = 'transactions'"
          :class="['tab-btn', { 'active': activeTab === 'transactions' }]"
          :style="activeTab === 'transactions' ? activeTabStyle : inactiveTabStyle"
        >
          Recent Transactions
        </button>
      </div>

      <!-- RECENT ORDERS TAB -->
      <div v-show="activeTab === 'orders'" class="tab-content">
        <div class="activity-section">
          <div class="activity-list">
            <div v-for="order in recentOrders" :key="order.id" class="activity-item">
              <div class="activity-icon">📦</div>
              <div class="activity-content">
                <p>
                  <strong>New order #{{ order.id }}</strong> 
                  - {{ order.game }} ({{ order.service_type }})
                  <br>
                  <small>by {{ order.user_name }}</small>
                </p>
                <span class="activity-time">{{ order.created_at_human }}</span>
              </div>
            </div>
            <p v-if="recentOrders.length === 0" class="empty-activity">No recent orders.</p>
          </div>
        </div>
      </div>

      <!-- RECENT TRANSACTIONS TAB -->
      <div v-show="activeTab === 'transactions'" class="tab-content">
        <div class="activity-section">
          <div class="activity-list">
            <div v-for="transaction in recentTransactions" :key="transaction.id" class="activity-item">
              <div class="activity-icon">💳</div>
              <div class="activity-content">
                <p>
                  <strong>Transaction #{{ transaction.id }}</strong>
                  - ₱{{ transaction.amount.toLocaleString() }}
                  <status-badge :status="transaction.status" style="margin-left: 10px; font-size: 11px;"></status-badge>
                  <br>
                  <small>{{ transaction.user_name }} - Order #{{ transaction.order_id }}</small>
                </p>
                <span class="activity-time">{{ transaction.created_at_human }}</span>
              </div>
            </div>
            <p v-if="recentTransactions.length === 0" class="empty-activity">No recent transactions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  initialStats: { type: Object, required: true },
  initialOrders: { type: Array, default: () => [] },
  initialTransactions: { type: Array, default: () => [] },
  apiUrl: { type: String, required: true }
});

const stats = ref(props.initialStats);
const recentOrders = ref(props.initialOrders);
const recentTransactions = ref(props.initialTransactions);
const activeTab = ref('orders');
const loading = ref(false);
let pollInterval = null;

const activeTabStyle = {
  padding: '10px 20px',
  border: 'none',
  background: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  borderBottom: '2px solid #667eea',
  marginBottom: '-2px'
};

const inactiveTabStyle = {
  padding: '10px 20px',
  border: 'none',
  background: 'none',
  fontWeight: '600',
  cursor: 'pointer',
  color: '#888'
};

async function refreshStats(showLoading = true) {
  if (showLoading) loading.value = true;
  try {
    const response = await axios.get(props.apiUrl);
    if (response.data.success) {
      stats.value = response.data.stats;
      recentOrders.value = response.data.recentOrders;
      recentTransactions.value = response.data.recentTransactions;
    }
  } catch (error) {
    console.error('Failed to refresh stats:', error);
    if (showLoading) alert('Error refreshing data from database.');
  } finally {
    if (showLoading) loading.value = false;
  }
}

onMounted(() => {
  // Auto-refresh every 30 seconds
  pollInterval = setInterval(() => {
    refreshStats(false); // Silent refresh
  }, 30000);
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>

<style scoped>
/* Tab animations and polish */
.tab-btn {
  transition: all 0.3s ease;
}
.tab-btn:hover {
  color: #667eea !important;
}
.activity-item {
  animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>