<template>
  <div class="content-section">
    <div v-if="loading" class="text-center p-10">
      <p>Loading order details...</p>
    </div>

    <template v-else-if="order">
      <div class="section-header">
        <h1>Order Details</h1>
        <router-link to="/agent/order" class="btn-secondary">
          ← Back to My Tasks
        </router-link>
      </div>

      <info-card>
        <template #header>
          <div>
            <h3 style="margin: 0; font-size: 18px; color: #333;">Order #{{ order.id }}</h3>
            <span class="order-date">
              {{ formatDateLong(order.created_at) }}
            </span>
          </div>
        </template>
        <template #action>
          <status-badge :status="order.status"></status-badge>
        </template>
      </info-card>

      <info-card title="Service Details" :use-body="true">
        <detail-row label="Game" :value="order.game"></detail-row>
        <detail-row label="Category" :value="capitalize(order.service_category)"></detail-row>
        <detail-row label="Service Type" :value="order.service_type"></detail-row>
        <detail-row label="Customer" :value="order.user?.name || 'Unknown User'"></detail-row>
        <detail-row label="Amount Paid" :value="order.price" :is-price="true"></detail-row>
      </info-card>

      <info-card title="Timeline" :use-body="true">
        <detail-row label="Order Placed" :value="formatDate(order.created_at)"></detail-row>
        
        <detail-row v-if="order.status === 'completed'" label="Completed On" :value="formatDate(order.updated_at)"></detail-row>
        <detail-row v-else label="Status" value="Work in progress..." value-class="status-text-pending"></detail-row>
      </info-card>

      <info-card title="Actions" :use-body="true">
        <div class="agent-actions mt-20">
          <router-link :to="`/agent/order/${order.id}/chat`" class="action-btn secondary">
            Chat with Customer
          </router-link>

          <button 
            v-if="order.status !== 'completed'" 
            @click="showCompleteModal = true"
            class="action-btn success flex-1"
            :disabled="submitting"
          >
            Mark as Complete
          </button>
          <button v-else class="btn-disabled" disabled>
            Order Completed
          </button>
        </div>
      </info-card>

      <!-- Completion Confirmation Modal -->
      <div v-if="showCompleteModal" class="modal" style="display: block;">
        <div class="modal-content modal-small">
          <div class="modal-header">
            <h2>Complete Order?</h2>
            <span class="close-modal" @click="showCompleteModal = false">&times;</span>
          </div>
          <div class="modal-body text-center" style="padding: 30px;">
            <p class="mb-20">Are you sure you want to mark Order #{{ order.id }} as complete?</p>
            <div class="modal-actions" style="display: flex; gap: 10px;">
              <button type="button" @click="showCompleteModal = false" class="btn-secondary flex-1">
                Cancel
              </button>
              <button type="button" @click="markComplete" class="btn-primary flex-1" :disabled="submitting">
                {{ submitting ? 'Updating...' : 'Yes, Complete' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center p-10">
      <p>Order not found.</p>
      <router-link to="/agent/order" class="btn-secondary">Back to Tasks</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import InfoCard from '../../components/InfoCard.vue';
import DetailRow from '../../components/DetailRow.vue';
import StatusBadge from '../../components/StatusBadge.vue';

const route = useRoute();
const order = ref(null);
const loading = ref(true);
const submitting = ref(false);
const showCompleteModal = ref(false);

async function fetchOrder() {
  try {
    const response = await axios.get(`/api/v1/agent/orders/${route.params.id}`);
    if (response.data.success) {
      order.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch order:', error);
  } finally {
    loading.value = false;
  }
}

async function markComplete() {
  submitting.value = true;
  try {
    const response = await axios.patch(`/api/v1/agent/orders/${order.value.id}/complete`);
    if (response.data.success) {
      order.value = response.data.data;
      showCompleteModal.value = false;
    }
  } catch (error) {
    console.error('Failed to complete order:', error);
    alert('Failed to update status.');
  } finally {
    submitting.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function formatDateLong(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

onMounted(fetchOrder);
</script>

<style scoped>
.mt-20 { margin-top: 20px; }
.agent-actions { display: flex; gap: 15px; }
.status-text-pending { color: #888; font-style: italic; }
.btn-disabled {
  background-color: #e0e0e0;
  color: #888;
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  cursor: not-allowed;
  font-weight: 600;
  flex: 1;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 0;
  border-radius: 15px;
  overflow: hidden;
  max-width: 400px;
  width: 90%;
}
.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-modal {
  cursor: pointer;
  font-size: 24px;
}
.modal-body {
  padding: 20px;
}
.mb-20 { margin-bottom: 20px; }
.flex-1 { flex: 1; }
</style>
