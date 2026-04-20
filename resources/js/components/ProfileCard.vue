<template>
  <div class="profile-card">
    <div class="profile-header">
      <div class="avatar">
        <img v-if="avatarUrl" :src="avatarUrl" alt="User Avatar">
        <div v-else class="avatar-text">
            {{ initials }}
        </div>
      </div>
      <div class="profile-info">
        <h2>{{ name }}</h2>
        <p class="user-status">{{ formattedRole }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: { type: String, required: true },
  role: { type: String, required: true },
  avatar: { type: String, default: '' }
});

const avatarUrl = computed(() => props.avatar);

const initials = computed(() => {
  if (!props.name) return '??';
  return props.name.substring(0, 2).toUpperCase();
});

const formattedRole = computed(() => {
  if (!props.role) return '';
  return props.role.charAt(0).toUpperCase() + props.role.slice(1);
});
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>