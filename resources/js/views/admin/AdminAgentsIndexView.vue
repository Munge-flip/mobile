<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Agents Management</h1>
      <router-link to="/admin/agent/create" class="btn-primary">
        + Add Agent
      </router-link>
    </div>

    <div v-if="loading" class="text-center p-10">
      <p>Loading agents...</p>
    </div>

    <div v-else class="agents-grid">
      <agent-card 
        v-for="agent in agents"
        :key="agent.id"
        :id="agent.id"
        :name="agent.name"
        :status="agent.status || 'Active'"
        :active-orders="agent.tasks_count"
        :orders-route="`/admin/order?agent_id=${agent.id}`"
        :manage-route="`/admin/user/${agent.id}/edit`"
      ></agent-card>
      
      <p v-if="agents.length === 0">No agents found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AgentCard from '../../components/AgentCard.vue';

const agents = ref([]);
const loading = ref(true);

async function fetchAgents() {
  try {
    const response = await axios.get('/api/v1/admin/agents');
    if (response.data.success) {
      agents.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch agents:', error);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchAgents);
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
