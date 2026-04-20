<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Transaction Details</h1>
      <router-link to="/admin/transactions" class="action-link">
        ← Back to Transactions
      </router-link>
    </div>

    <div v-if="loading" class="text-center p-10">
      <p>Loading transaction details...</p>
    </div>

    <template v-else-if="transaction">
      <admin-card>
        <template #header>
          <div>
            <h3 style="margin: 0; font-size: 18px; color: #333;">Transaction #{{ transaction.id }}</h3>
            <span class="order-date">
              {{ formatDateLong(transaction.created_at) }}
            </span>
          </div>
        </template>
        <template #action>
          <status-badge :status="transaction.status"></status-badge>
        </template>
      </admin-card>

      <admin-card title="Payment Information" :use-body="true">
        <detail-row label="Amount" :value="transaction.amount" :is-price="true"></detail-row>
        <detail-row label="Payment Method" :value="transaction.payment_method" value-class="text-uppercase"></detail-row>
        <detail-row label="Transaction Reference" :value="transaction.transaction_reference || 'N/A'"></detail-row>
        <detail-row label="Payment Date" :value="formatDateLong(transaction.paid_at)"></detail-row>
        <detail-row label="Related Order">
          <router-link :to="`/admin/order/${transaction.order_id}`" 
             style="color: #667eea; text-decoration: underline;">
            Order #{{ transaction.order_id }}
          </router-link>
        </detail-row>
        <detail-row label="Customer" :value="transaction.user?.name || 'Unknown'"></detail-row>
      </admin-card>

      <admin-card v-if="transaction.payment_proof" title="Payment Proof" :use-body="true">
        <img :src="`/storage/${transaction.payment_proof}`" 
             alt="Payment Proof" 
             style="max-width: 100%; border-radius: 10px; border: 2px solid #e0e0e0;">
        <div style="margin-top: 15px;">
          <a :href="`/api/v1/admin/transactions/${transaction.id}/download-proof`" 
             target="_blank"
             class="btn-secondary">
            Download Proof
          </a>
        </div>
      </admin-card>

      <admin-card v-if="transaction.status === 'pending'" title="Verify Transaction" :use-body="true">
        <form @submit.prevent="handleVerify">
          <div class="form-group">
            <label>Decision</label>
            <select v-model="verifyForm.status" required class="search-input" style="width: 100%;">
              <option value="">Select Action</option>
              <option value="verified">Approve Payment</option>
              <option value="rejected">Reject Payment</option>
            </select>
          </div>

          <div class="form-group">
            <label>Admin Notes (Optional)</label>
            <textarea v-model="verifyForm.admin_notes" rows="3" class="search-input" 
                      style="width: 100%; resize: vertical;"
                      placeholder="Add any notes about this verification..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-primary" :disabled="submitting">
              {{ submitting ? 'Submitting...' : 'Submit Verification' }}
            </button>
          </div>
        </form>
      </admin-card>

      <admin-card v-else title="Verification Details" :use-body="true">
        <detail-row label="Verified By" :value="transaction.verified_by_user?.name || 'N/A'"></detail-row>
        <detail-row label="Verified At" :value="formatDateLong(transaction.verified_at)"></detail-row>
        
        <div v-if="transaction.admin_notes" style="margin-top: 10px;">
          <strong>Admin Notes:</strong>
          <p style="margin-top: 5px; color: #666;">{{ transaction.admin_notes }}</p>
        </div>
      </admin-card>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import AdminCard from '../../components/AdminCard.vue';
import DetailRow from '../../components/DetailRow.vue';
import StatusBadge from '../../components/StatusBadge.vue';

const route = useRoute();
const router = useRouter();
const transaction = ref(null);
const loading = ref(true);
const submitting = ref(false);

const verifyForm = reactive({
  status: '',
  admin_notes: ''
});

async function fetchTransaction() {
  try {
    const response = await axios.get(`/api/v1/admin/transactions/${route.params.id}`);
    if (response.data.success) {
      transaction.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
  } finally {
    loading.value = false;
  }
}

async function handleVerify() {
  if (!verifyForm.status || submitting.value) return;
  submitting.value = true;

  try {
    const response = await axios.patch(`/api/v1/admin/transactions/${transaction.value.id}/verify`, verifyForm);
    if (response.data.success) {
      // Redirect to orders table instead of alert
      router.push('/admin/order');
    }
  } catch (error) {
    alert('Failed to verify transaction.');
  } finally {
    submitting.value = false;
  }
}

function formatDateLong(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

onMounted(fetchTransaction);
</script>

<style scoped>
.text-uppercase { text-transform: uppercase; }
</style>
