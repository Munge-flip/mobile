<template>
  <div v-if="serviceStore.loading" class="catalog-loader">
    <div class="loader-content">
      <span class="spinner">🔄</span>
      <p>Updating latest service prices and availability...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { serviceStore } from '../stores/serviceStore';

const props = defineProps({
  game: { type: String, required: true }
});

onMounted(() => {
  serviceStore.fetchServices(props.game);
});
</script>

<style scoped>
.catalog-loader {
  background: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #a78bfa;
  animation: pulse 2s infinite;
}
.loader-content {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
  color: #667eea;
  font-weight: 600;
}
.spinner {
  display: inline-block;
  animation: rotate 2s linear infinite;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>