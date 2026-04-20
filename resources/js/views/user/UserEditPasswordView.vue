<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Change Password</h1>
      <router-link to="/user" class="action-link">
        ← Back to Dashboard
      </router-link>
    </div>

    <info-card>
      <div v-if="successMsg" class="alert-success" style="color: #27ae60; background: rgba(39, 174, 96, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px;">
        {{ successMsg }}
      </div>

      <div v-if="errorMsg" class="alert-error" style="color: #e74c3c; background: rgba(231, 76, 60, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px;">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Current Password</label>
          <input type="password" v-model="form.current_password" required :disabled="loading">
          <span v-if="errors.current_password" class="text-error">{{ errors.current_password[0] }}</span>
        </div>

        <div class="form-group">
          <label>New Password</label>
          <input type="password" v-model="form.password" required minlength="8" :disabled="loading">
          <span v-if="errors.password" class="text-error">{{ errors.password[0] }}</span>
        </div>

        <div class="form-group">
          <label>Confirm New Password</label>
          <input type="password" v-model="form.password_confirmation" required :disabled="loading">
        </div>

        <div class="modal-actions">
          <router-link to="/user" class="btn-secondary">Cancel</router-link>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Updating...' : 'Update Password' }}
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
import InfoCard from '../../components/InfoCard.vue';

const router = useRouter();
const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');
const errors = reactive({});

const form = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
});

async function handleUpdate() {
  loading.value = true;
  successMsg.value = '';
  errorMsg.value = '';
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const response = await axios.put('/api/v1/user/password', form);
    if (response.data.success) {
      successMsg.value = response.data.message;
      form.current_password = '';
      form.password = '';
      form.password_confirmation = '';
      setTimeout(() => {
        router.push('/user');
      }, 1500);
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      Object.assign(errors, error.response.data.errors);
      errorMsg.value = error.response.data.message;
    } else {
      errorMsg.value = 'An error occurred while updating your password.';
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
