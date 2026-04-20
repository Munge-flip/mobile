<template>
  <div class="content-section">
    <div v-if="loading" class="text-center p-10">
      <p>Loading transaction details...</p>
    </div>

    <template v-else-if="transaction">
      <div class="section-header">
        <h1>Transaction Details</h1>
        <router-link to="/user/transactions" class="btn-secondary">
          ← Back to Transactions
        </router-link>
      </div>

      <info-card>
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
      </info-card>

      <info-card title="Payment Information" :use-body="true">
        <detail-row label="Amount Paid" :value="transaction.amount" :is-price="true"></detail-row>
        <detail-row label="Payment Method" :value="transaction.payment_method" value-class="text-uppercase"></detail-row>
        <detail-row label="Transaction Reference" :value="transaction.transaction_reference || 'Not provided'"></detail-row>
        <detail-row label="Payment Date" :value="formatDateLong(transaction.paid_at)"></detail-row>
        <detail-row label="Related Order">
          <router-link :to="`/user/order/${transaction.order_id}`" 
             style="color: #667eea; text-decoration: underline;">
            Order #{{ transaction.order_id }} - {{ transaction.order?.game || 'Loading...' }}
          </router-link>
        </detail-row>
      </info-card>

      <info-card v-if="transaction.payment_proof" title="Payment Proof" :use-body="true">
        <img :src="`/storage/${transaction.payment_proof}`" 
             alt="Payment Proof" 
             style="max-width: 100%; border-radius: 10px; border: 2px solid #e0e0e0; margin-top: 15px;">
      </info-card>

      <info-card title="Status Information" :use-body="true">
        <template v-if="transaction.status === 'pending'">
          <p style="color: #f39c12; font-weight: 600;">
            ⏳ Your payment is pending verification by our admin team.
          </p>
          <p style="color: #666; margin-top: 10px;">
            We'll notify you once your payment has been verified. This usually takes 1-24 hours.
          </p>
        </template>
        <template v-else-if="transaction.status === 'verified'">
          <p style="color: #27ae60; font-weight: 600;">
            ✅ Your payment has been verified!
          </p>
          <div v-if="transaction.verified_at" style="margin-top: 10px;">
            <detail-row label="Verified At" :value="formatDateLong(transaction.verified_at)"></detail-row>
          </div>
        </template>
        <template v-else-if="transaction.status === 'rejected'">
          <p style="color: #e74c3c; font-weight: 600;">
            ❌ Your payment was not verified.
          </p>
          <div v-if="transaction.admin_notes" style="margin-top: 10px;">
            <strong>Reason:</strong>
            <p style="color: #666; margin-top: 5px;">{{ transaction.admin_notes }}</p>
          </div>
          <p style="color: #666; margin-top: 10px;">
            Please contact support or submit a new payment with the correct details.
          </p>
        </template>
      </info-card>
    </template>

    <div v-else class="text-center p-10">
      <p>Transaction not found.</p>
      <router-link to="/user/transactions" class="btn-secondary">Back to Transactions</router-link>
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
const transaction = ref(null);
const loading = ref(true);

async function fetchTransaction() {
  try {
    const response = await axios.get(`/api/v1/user/transactions/${route.params.id}`, {
        headers: { 'Accept': 'application/json' }
    });
    if (response.data.success) {
      transaction.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch transaction:', error);
  } finally {
    loading.value = false;
  }
}

function formatDateLong(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

onMounted(fetchTransaction);
</script>

<style scoped>
.text-uppercase { text-transform: uppercase; }
</style>
