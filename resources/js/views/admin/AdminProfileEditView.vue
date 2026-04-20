<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Edit Personal Information</h1>
      <router-link to="/admin/profile" class="action-link">
        ← Back to Profile
      </router-link>
    </div>

    <admin-card>
      <div v-if="successMsg" class="alert-success" style="color: #27ae60; background: rgba(39, 174, 96, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 20px;">
        {{ successMsg }}
      </div>

      <form @submit.prevent="handleUpdate" class="modal-form">
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
          <router-link to="/admin/profile" class="btn-secondary">Cancel</router-link>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </admin-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AdminCard from '../../components/AdminCard.vue';

const router = useRouter();
const loading = ref(false);
const successMsg = ref('');
const errors = reactive({});

const form = reactive({
  name: '',
  email: '',
  phone: ''
});

async function fetchProfile() {
  try {
    const response = await axios.get('/api/v1/admin/profile');
    if (response.data.success) {
      const user = response.data.data;
      form.name = user.name;
      form.email = user.email;
      form.phone = user.phone || '';
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
}

async function handleUpdate() {
  loading.value = true;
  successMsg.value = '';
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const response = await axios.patch('/api/v1/admin/profile', form);
    if (response.data.success) {
      successMsg.value = response.data.message;
      // Update global user if needed
      if (window.User) {
          Object.assign(window.User, response.data.data);
      }
      setTimeout(() => {
        router.push('/admin/profile');
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

onMounted(fetchProfile);
</script>

<style scoped>
.text-error {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 5px;
  display: block;
}
</style>
