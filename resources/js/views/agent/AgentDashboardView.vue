<template>
  <div class="content-section">
    <h1>My Account</h1>

    <div v-if="loading" class="text-center p-10">
      <p>Loading account details...</p>
    </div>

    <template v-else-if="agent">
      <agent-profile-card 
        :name="agent.name" 
        :id="agent.id" 
        :handling="stats.handling" 
        :completed="stats.completed" 
        :rate="stats.rate"
        api-url="/api/v1/agent/stats"
      ></agent-profile-card>

      <info-card title="Personal Information" manage-route="/agent/edit" :use-body="true">
        <div class="info-grid">
          <div class="info-item">
            <label>Name</label>
            <p>{{ agent.name }}</p>
          </div>
          <div class="info-item">
            <label>Email Address</label>
            <p>{{ agent.email }}</p>
          </div>
          <div class="info-item">
            <label>Mobile Number</label>
            <p>{{ agent.phone || 'Not set' }}</p>
          </div>
        </div>
      </info-card>

      <info-card title="Password and Security" manage-route="/agent/update" :use-body="true">
        <div class="info-grid">
          <div class="info-item">
            <label>Password</label>
            <p>••••••••</p>
          </div>
          <div class="info-item">
            <label>Account Created</label>
            <p>{{ formatDate(agent.created_at) }}</p>
          </div>
        </div>
      </info-card>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AgentProfileCard from '../../components/AgentProfileCard.vue';
import InfoCard from '../../components/InfoCard.vue';

const agent = ref(null);
const stats = ref({ handling: 0, completed: 0, rate: '0%' });
const loading = ref(true);

async function fetchDashboardData() {
  try {
    const response = await axios.get('/api/v1/agent/stats');
    if (response.data.success) {
      agent.value = response.data.agent;
      stats.value = response.data.stats;
    }
  } catch (error) {
    console.error('Failed to fetch agent dashboard data:', error);
  } finally {
    loading.value = false;
  }
}

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

onMounted(fetchDashboardData);
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
