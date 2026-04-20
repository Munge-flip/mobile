<template>
  <div class="content-section">
    <div v-if="loading" class="text-center p-10">
      <p>Loading order details...</p>
    </div>

    <template v-else-if="order">
      <div class="section-header">
        <h1>Order Details</h1>
        <router-link to="/user/order" class="btn-secondary">
          ← Back to Orders
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

        <detail-row label="Amount" :align-center="true">
          <span class="price">₱{{ formatPrice(order.price) }}</span>

          <status-badge :status="order.payment_status" type="payment"></status-badge>

          <template v-if="order.payment_status === 'unpaid'">
            <button type="button" @click="showModal = true" class="btn-primary btn-sm">
              Submit Payment
            </button>
          </template>
          <template v-else-if="(order.payment_status === 'pending_verification' || order.payment_status === 'paid') && order.transaction">
            <router-link :to="`/user/transactions/${order.transaction.id}`" class="btn-secondary btn-sm">
              View Transaction
            </router-link>
          </template>
        </detail-row>

        <detail-row label="Payment Method">
          <strong class="text-uppercase">{{ order.payment_method || 'N/A' }}</strong>
        </detail-row>
      </info-card>

      <info-card title="Timeline" :use-body="true">
        <detail-row label="Order Placed" :value="formatDate(order.created_at)"></detail-row>
        <detail-row v-if="order.status === 'completed'" label="Completed On" :value="formatDate(order.updated_at)"></detail-row>
        <detail-row v-else label="Status" value="Work in progress..." value-class="status-text-pending"></detail-row>
      </info-card>

      <info-card title="Assigned Pilot" :use-body="true">
        <detail-row label="Pilot">
          <strong v-if="order.agent">{{ order.agent.name }}</strong>
          <span v-else class="text-pilot-missing">Finding a pilot...</span>
        </detail-row>
      </info-card>

      <!-- Payment Modal -->
      <div v-if="showModal" class="modal" style="display: block;">
        <div class="modal-content modal-medium">
          <div class="modal-header">
            <h2>Submit Payment</h2>
            <span class="close-modal" @click="showModal = false">&times;</span>
          </div>
          <div class="modal-body text-center" style="padding: 30px;">
            <p class="mb-20">
              Scan this QR code to pay
              <strong>₱{{ formatPrice(order.price) }}</strong>
              via <strong>{{ (order.payment_method || '').toUpperCase() }}</strong>
            </p>

            <img :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PayOrder${order.id}`" 
                 alt="Payment QR" 
                 class="qr-code">

            <form @submit.prevent="handlePaymentSubmit">
              <div class="form-group text-left">
                <label>Transaction Reference Number</label>
                <input type="text" v-model="paymentForm.transaction_reference" 
                       placeholder="e.g., GCash Ref #123456789" 
                       class="search-input w-100">
                <span class="text-help">Optional: Enter the reference number from your payment receipt</span>
              </div>

              <div class="form-group text-left">
                <label>Upload Payment Proof (Screenshot/Receipt)</label>
                <input type="file" @change="handleFileChange" accept="image/*" 
                       class="search-input w-100">
                <span class="text-help">Optional: Upload a screenshot of your payment confirmation</span>
              </div>

              <div class="modal-actions">
                <button type="button" @click="showModal = false" class="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" class="btn-primary flex-1" :disabled="submitting">
                  {{ submitting ? 'Processing...' : 'Submit Payment' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="text-center p-10">
      <p>Order not found.</p>
      <router-link to="/user/order" class="btn-secondary">Back to Orders</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import InfoCard from '../../components/InfoCard.vue';
import DetailRow from '../../components/DetailRow.vue';
import StatusBadge from '../../components/StatusBadge.vue';

const route = useRoute();
const router = useRouter();
const order = ref(null);
const loading = ref(true);
const showModal = ref(false);
const submitting = ref(false);

const paymentForm = reactive({
  transaction_reference: '',
  payment_proof: null
});

async function fetchOrder() {
  try {
    const response = await axios.get(`/api/v1/user/orders/${route.params.id}`, {
        headers: { 'Accept': 'application/json' }
    });
    if (response.data.success) {
      order.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch order:', error);
  } finally {
    loading.value = false;
  }
}

function handleFileChange(e) {
  paymentForm.payment_proof = e.target.files[0];
}

async function handlePaymentSubmit() {
  submitting.value = true;
  const formData = new FormData();
  formData.append('order_id', order.value.id);
  formData.append('transaction_reference', paymentForm.transaction_reference);
  if (paymentForm.payment_proof) {
    formData.append('payment_proof', paymentForm.payment_proof);
  }

  try {
    const response = await axios.post('/api/v1/user/transactions', formData, {
      headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
      }
    });
    if (response.data.success) {
      showModal.value = false;
      // Redirect to transaction details instead of alert
      router.push(`/user/transactions/${response.data.data.id}`);
    }
  } catch (error) {
    console.error('Payment submission failed:', error);
    alert('Failed to submit payment. ' + (error.response?.data?.message || ''));
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

function formatPrice(val) {
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

onMounted(fetchOrder);
</script>

<style scoped>
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
  max-width: 600px;
  width: 90%;
}
.qr-code { max-width: 200px; margin: 0 auto 20px; display: block; border: 5px solid #f0f0f0; border-radius: 10px; }
.text-pilot-missing { color: #e74c3c; font-style: italic; }
.status-text-pending { color: #888; font-style: italic; }
</style>
