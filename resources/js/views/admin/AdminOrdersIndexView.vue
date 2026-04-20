<template>
  <div class="content-section">
    <admin-order-table api-url="/api/v1/admin/orders"></admin-order-table>
  </div>
</template>

<script setup>
import AdminOrderTable from '../../components/AdminOrderTable.vue';
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
