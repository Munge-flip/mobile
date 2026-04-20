<template>
  <div class="content-section">
    <h1>My Account</h1>

    <profile-card 
      v-if="authStore.user"
      :name="authStore.user.name" 
      :role="authStore.user.role" 
      :avatar="authStore.user.avatar ? `/${authStore.user.avatar}` : ''"
    ></profile-card>

    <info-card title="Personal Information" manage-route="/user/edit">
      <div v-if="authStore.user" class="info-grid">
        <div class="info-item">
          <label>Name</label> <p>{{ authStore.user.name }}</p>
        </div>
        <div class="info-item">
          <label>Email Address</label>
          <p>{{ authStore.user.email }}</p>
        </div>
        <div class="info-item">
          <label>Mobile Number</label>
          <p>{{ authStore.user.phone || 'Not set' }}</p>
        </div>
      </div>
    </info-card>

    <info-card title="Password and Security" manage-route="/user/update">
      <div v-if="authStore.user" class="info-grid">
        <div class="info-item">
          <label>Password</label>
          <p>••••••••</p>
        </div>
        <div class="info-item">
          <label>Account Created</label>
          <p>{{ formatDate(authStore.user.created_at) }}</p>
        </div>
      </div>
    </info-card>
  </div>
</template>

<script setup>
import { authStore } from '../../stores/authStore';
import ProfileCard from '../../components/ProfileCard.vue';
import InfoCard from '../../components/InfoCard.vue';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}
</script>

<style scoped>
/* Inherits from dashboard.css */
</style>
