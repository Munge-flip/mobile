<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Add New Agent</h1>
      <router-link to="/admin/agent" class="action-link">← Back to Agents</router-link>
    </div>

    <admin-card title="Agent Information" :use-body="false">
      <div v-if="errorMsg" class="alert-error">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label>Agent Name</label>
          <input type="text" v-model="form.name" required :disabled="loading">
          <span v-if="errors.name" class="text-error">{{ errors.name[0] }}</span>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" required :disabled="loading">
          <span v-if="errors.email" class="text-error">{{ errors.email[0] }}</span>
        </div>

        <div class="form-group">
          <label>Phone Number</label>
          <input type="tel" v-model="form.phone" required :disabled="loading">
          <span v-if="errors.phone" class="text-error">{{ errors.phone[0] }}</span>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" required minlength="8" :disabled="loading">
          <span v-if="errors.password" class="text-error">{{ errors.password[0] }}</span>
        </div>

        <div class="modal-actions">
          <router-link to="/admin/agent" class="btn-secondary">Cancel</router-link>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Adding...' : 'Add Agent' }}
          </button>
        </div>
      </form>
    </admin-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import AdminCard from '../../components/AdminCard.vue';

const router = useRouter();
const loading = ref(false);
const errorMsg = ref('');
const errors = reactive({});

const form = reactive({
  name: '',
  email: '',
  phone: '',
  password: ''
});

async function handleSubmit() {
  loading.value = true;
  errorMsg.value = '';
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const response = await axios.post('/api/v1/admin/agents', form);
    if (response.data.success) {
      router.push('/admin/agent');
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      Object.assign(errors, error.response.data.errors);
    } else {
      errorMsg.value = 'Failed to add agent. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.alert-error {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.text-error {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 5px;
  display: block;
}
</style>
