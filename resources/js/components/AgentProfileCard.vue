<template>
  <div class="agent-profile-card">
    <div class="profile-header">
      <div class="avatar">
        <div class="avatar-text">
          {{ initials }}
        </div>
      </div>
      <div class="profile-info">
        <h2>{{ name }}</h2>
        <p class="agent-role">Agent ID: #{{ id }}</p>
      </div>
      <div v-if="apiUrl" class="flex-1 text-right">
        <button @click="fetchStats" class="btn-secondary btn-sm" style="background: rgba(255,255,255,0.2); color: white; border: none;">
          <span v-if="loading">...</span>
          <span v-else>🔄</span>
        </button>
      </div>
    </div>

    <div class="performance-stats">
      <div class="stat-item">
        <div class="stat-icon">📦</div>
        <div class="stat-details">
          <p class="stat-label">Orders Handling</p>
          <p class="stat-value">{{ currentStats.handling }}</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">✅</div>
        <div class="stat-details">
          <p class="stat-label">Completed</p>
          <p class="stat-value">{{ currentStats.completed }}</p>
        </div>
      </div>
      <div class="stat-item">
        <div class="stat-icon">📊</div>
        <div class="stat-details">
          <p class="stat-label">Completion Rate</p>
          <p class="stat-value">{{ currentStats.rate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  name: { type: String, required: true },
  id: { type: [String, Number], required: true },
  handling: { type: [String, Number], default: 0 },
  completed: { type: [String, Number], default: 0 },
  rate: { type: String, default: '0%' },
  apiUrl: { type: String, default: '' }
});

const currentStats = ref({
  handling: props.handling,
  completed: props.completed,
  rate: props.rate
});

const loading = ref(false);

const initials = computed(() => {
  if (!props.name) return '??';
  return props.name.substring(0, 2).toUpperCase();
});

async function fetchStats() {
  if (!props.apiUrl) return;
  loading.value = true;
  try {
    const response = await axios.get(props.apiUrl);
    if (response.data.success) {
      currentStats.value = response.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch agent stats:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (props.apiUrl) {
    fetchStats();
  }
});
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>