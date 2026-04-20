<template>
  <div v-if="orderData" class="order-details-container">
    <div class="section-header">
      <h1>Order Details</h1>
      <div class="header-actions">
        <router-link to="/admin/order" class="action-link">← Back to Orders</router-link>
        <button @click="showDeleteModal = true" class="btn-danger btn-sm ml-10">Delete Order</button>
      </div>
    </div>

    <!-- Status Card -->
    <admin-card>
      <template #header>
        <div>
          <h3 style="margin: 0; font-size: 18px; color: #333;">Order #{{ orderData.id }}</h3>
          <span class="order-date">{{ formatDate(orderData.created_at) }}</span>
        </div>
      </template>
      <template #action>
        <status-badge :status="orderData.status"></status-badge>
      </template>
    </admin-card>

    <!-- Service Details -->
    <admin-card title="Service Details">
      <detail-row label="Game" :value="orderData.game"></detail-row>
      <detail-row label="Category" :value="orderData.service_category"></detail-row>
      <detail-row label="Service Type" :value="orderData.service_type"></detail-row>
      <detail-row label="Customer">
        <strong>{{ orderData.user?.name || 'Unknown' }} <span class="user-id-sub">(ID: #{{ orderData.user_id }})</span></strong>
      </detail-row>
      <detail-row label="Amount Paid" :value="orderData.price" :is-price="true"></detail-row>
    </admin-card>

    <!-- Assignment Card -->
    <admin-card title="Assignment">
      <detail-row label="Current Agent" :value="orderData.agent?.name || 'Unassigned'"></detail-row>

      <div class="assignment-section">
        <div class="form-group">
          <label>Assign to Agent:</label>
          <div class="assignment-row">
            <select v-model="selectedAgentId" class="search-input assignment-select">
              <option value="" disabled>Select an Agent</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.id">
                {{ agent.name }}
              </option>
            </select>
            <button @click="assignAgent" class="btn-primary" :disabled="processingAssignment">
              {{ processingAssignment ? '...' : 'Assign' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="orderData.status !== 'completed'" class="mt-15">
        <button @click="showCompleteModal = true" class="action-btn success w-100" :disabled="processingStatus">
          Mark as Complete
        </button>
      </div>
    </admin-card>

    <!-- Timeline -->
    <admin-card title="Timeline">
      <detail-row label="Order Placed" :value="formatDate(orderData.created_at)"></detail-row>
      <detail-row label="Status">
        <strong v-if="orderData.status === 'completed'" style="color: #0f5132;">
          Completed on {{ formatDate(orderData.updated_at) }}
        </strong>
        <span v-else class="status-text-pending">In Progress...</span>
      </detail-row>
    </admin-card>

    <!-- Completion Confirmation Modal -->
    <div v-if="showCompleteModal" class="modal" style="display: block;">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h2>Complete Order?</h2>
          <span class="close-modal" @click="showCompleteModal = false">&times;</span>
        </div>
        <div class="modal-body text-center" style="padding: 30px;">
          <p class="mb-20">Are you sure you want to mark Order #{{ orderData.id }} as complete?</p>
          <div class="modal-actions" style="display: flex; gap: 10px;">
            <button type="button" @click="showCompleteModal = false" class="btn-secondary flex-1">
              Cancel
            </button>
            <button type="button" @click="markComplete" class="btn-primary flex-1" :disabled="processingStatus">
              {{ processingStatus ? 'Updating...' : 'Yes, Complete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" style="display: block;">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h2>Delete Order?</h2>
          <span class="close-modal" @click="showDeleteModal = false">&times;</span>
        </div>
        <div class="modal-body text-center" style="padding: 30px;">
          <p class="mb-20">Are you sure you want to delete Order #{{ orderData.id }}? This action cannot be undone.</p>
          <div class="modal-actions" style="display: flex; gap: 10px;">
            <button type="button" @click="showDeleteModal = false" class="btn-secondary flex-1">
              Cancel
            </button>
            <button type="button" @click="handleDelete" class="btn-danger flex-1" :disabled="deleting">
              {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AdminCard from './AdminCard.vue';
import DetailRow from './DetailRow.vue';
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
  initialOrder: { type: Object, required: true },
  agents: { type: Array, default: () => [] },
  apiUrl: { type: String, required: true }
});

const router = useRouter();
const orderData = ref(props.initialOrder);
const selectedAgentId = ref(props.initialOrder.agent_id || '');
const processingAssignment = ref(false);
const processingStatus = ref(false);
const showCompleteModal = ref(false);
const showDeleteModal = ref(false);
const deleting = ref(false);

async function assignAgent() {
  if (!selectedAgentId.value) return;
  processingAssignment.value = true;
  
  try {
    const response = await axios.patch(`${props.apiUrl}/${orderData.value.id}/assign`, {
      agent_id: selectedAgentId.value
    });
    
    if (response.data.success) {
      // Redirect to orders table instead of alert
      router.push('/admin/order');
    }
  } catch (error) {
    alert('Error: ' + (error.response?.data?.message || 'Failed to assign agent.'));
  } finally {
    processingAssignment.value = false;
  }
}

async function markComplete() {
  processingStatus.value = true;
  
  try {
    const response = await axios.patch(`${props.apiUrl}/${orderData.value.id}`, {
      status: 'completed'
    });
    
    if (response.data.success) {
      orderData.value = response.data.data;
      showCompleteModal.value = false;
    }
  } catch (error) {
    alert('Error: ' + (error.response?.data?.message || 'Failed to update status.'));
  } finally {
    processingStatus.value = false;
  }
}

async function handleDelete() {
  deleting.value = true;
  try {
    const response = await axios.delete(`${props.apiUrl}/${orderData.value.id}`);
    if (response.data.success) {
      router.push('/admin/order');
    }
  } catch (error) {
    alert('Failed to delete order.');
  } finally {
    deleting.value = false;
    showDeleteModal.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}
</script>

<script>
// For backward compatibility with global registration
export default {
  inheritAttrs: false
}
</script>

<style scoped>
.user-id-sub { color: #888; font-weight: normal; font-size: 13px; }
.status-text-pending { color: #888; font-style: italic; }
.assignment-section { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
.assignment-row { display: flex; gap: 10px; }
.assignment-select { flex: 1; }
.mt-15 { margin-top: 15px; }
.ml-10 { margin-left: 10px; }

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
.header-actions { display: flex; align-items: center; }
</style>
