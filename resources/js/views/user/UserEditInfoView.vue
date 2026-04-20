<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Edit Personal Information</h1>
      <router-link to="/user" class="action-link">
        ← Back to Dashboard
      </router-link>
    </div>

    <info-card>
      <div v-if="successMsg" class="alert-success mb-4" style="color: #27ae60; background: rgba(39, 174, 96, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px;">
        {{ successMsg }}
      </div>

      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Name</label>
          <input type="text" v-model="form.name" required :disabled="loading">
          <span v-if="errors.name" class="text-error">{{ errors.name[0] }}</span>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="form.email" required :disabled="loading">
          <span v-if="errors.email" class="text-error">{{ errors.email[0] }}</span>
        </div>

        <div class="form-group">
          <label>Mobile Number</label>
          <input type="tel" v-model="form.phone" :disabled="loading">
          <span v-if="errors.phone" class="text-error">{{ errors.phone[0] }}</span>
        </div>

        <div class="modal-actions">
          <router-link to="/user" class="btn-secondary">Cancel</router-link>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </info-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { authStore } from '../../stores/authStore';
import InfoCard from '../../components/InfoCard.vue';

const router = useRouter();
const user = authStore.user || {};

const form = reactive({
  name: user.name || '',
  email: user.email || '',
  phone: user.phone || ''
});

const loading = ref(false);
const successMsg = ref('');
const errors = reactive({});

async function handleUpdate() {
  loading.value = true;
  successMsg.value = '';
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const response = await axios.patch('/api/v1/user/profile', form);
    if (response.data.success) {
      // Update store
      authStore.setUser(response.data.user);
      successMsg.value = response.data.message;
      setTimeout(() => {
        router.push('/user');
      }, 1500);
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      Object.assign(errors, error.response.data.errors);
    } else {
      alert('An error occurred while updating your profile.');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.text-error {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 5px;
  display: block;
}
</style>
