<template>
  <div class="content-section">
    <h1>Orders Handling</h1>
    <order-history-list 
      api-url="/api/v1/agent/orders" 
      view-base-url="/agent/order"
      :is-agent="true"
    ></order-history-list>
  </div>
</template>

<script setup>
import OrderHistoryList from '../../components/OrderHistoryList.vue';
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
