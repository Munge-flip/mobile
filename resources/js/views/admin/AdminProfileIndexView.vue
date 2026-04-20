<template>
  <div class="content-section">
    <h1>My Profile</h1>

    <div v-if="loading" class="text-center p-10">
      <p>Loading profile...</p>
    </div>

    <template v-else-if="user">
      <profile-card 
        :name="user.name" 
        role="Administrator" 
        :avatar="user.avatar ? `/storage/${user.avatar}` : ''"
      ></profile-card>

      <info-card title="Personal Information" manage-route="/admin/profile/edit" :use-body="true">
        <div class="info-grid">
          <div class="info-item">
            <label>Name</label>
            <p>{{ user.name }}</p>
          </div>
          <div class="info-item">
            <label>Email Address</label>
            <p>{{ user.email }}</p>
          </div>
          <div class="info-item">
            <label>Mobile Number</label>
            <p>{{ user.phone || 'Not set' }}</p>
          </div>
          <div class="info-item">
            <label>Role</label>
            <p style="text-transform: capitalize;">{{ user.role }}</p>
          </div>
        </div>
      </info-card>

      <info-card title="Password and Security" manage-route="/admin/profile/password" :use-body="true">
        <div class="info-grid">
          <div class="info-item">
            <label>Password</label>
            <p>••••••••</p>
          </div>
          <div class="info-item">
            <label>Account Created</label>
            <p>{{ formatDate(user.created_at) }}</p>
          </div>
        </div>
      </info-card>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ProfileCard from '../../components/ProfileCard.vue';
import InfoCard from '../../components/InfoCard.vue';

const user = ref(null);
const loading = ref(true);

async function fetchProfile() {
  try {
    const response = await axios.get('/api/v1/admin/profile');
    if (response.data.success) {
      user.value = response.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
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

onMounted(fetchProfile);
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>
