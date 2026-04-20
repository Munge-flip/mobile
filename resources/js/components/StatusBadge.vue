<template>
  <span :class="[baseClass, badgeClass]">
    {{ displayStatus }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: { type: String, required: true },
  type: { type: String, default: 'order' } // 'order', 'payment', 'role', 'service'
});

const baseClass = computed(() => {
  return props.type === 'payment' ? 'badge' : 'status-badge';
});

const badgeClass = computed(() => {
  if (props.type === 'payment') {
    if (props.status === 'paid') return 'completed';
    if (props.status === 'pending_verification') return 'in-progress';
    return 'pending'; // unpaid
  }
  
  if (props.type === 'role') {
    if (props.status === 'admin') return 'completed';
    return 'pending';
  }

  if (props.type === 'service') {
    return props.status === 'active' ? 'completed' : 'pending';
  }

  // order/transaction statuses
  if (props.status === 'completed' || props.status === 'verified') return 'completed';
  if (props.status === 'in-progress') return 'in-progress';
  return 'pending'; // pending, rejected
});

const displayStatus = computed(() => {
  if (props.type === 'payment') {
    if (props.status === 'pending_verification') return 'Pending Verification';
    if (props.status === 'paid') return 'Paid';
    if (props.status === 'unpaid') return 'Unpaid';
  }
  
  if (props.type === 'service') {
    return props.status === 'active' ? 'Active' : 'Inactive';
  }

  return props.status.charAt(0).toUpperCase() + props.status.slice(1);
});
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
