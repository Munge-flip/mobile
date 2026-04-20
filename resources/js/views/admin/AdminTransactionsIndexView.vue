<template>
  <div class="content-section">
    <admin-transaction-table api-url="/api/v1/admin/transactions"></admin-transaction-table>
  </div>
</template>

<script setup>
import AdminTransactionTable from '../../components/AdminTransactionTable.vue';
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
