<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Edit User</h1>
      <router-link to="/admin/user" class="action-link">
        ← Back to User List
      </router-link>
    </div>

    <div v-if="fetching" class="text-center p-10">
      <p>Loading user details...</p>
    </div>

    <admin-card v-else :title="`User Information: ${form.name}`" :use-body="false">
      <div v-if="errorMsg" class="alert-error">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label>Name</label>
          <input type="text" v-model="form.name" required :disabled="loading">
          <span v-if="errors.name" class="text-error">{{ errors.name[0] }}</span>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" required :disabled="loading">
          <span v-if="errors.email" class="text-error">{{ errors.email[0] }}</span>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <input type="text" v-model="form.phone" :disabled="loading">
          <span v-if="errors.phone" class="text-error">{{ errors.phone[0] }}</span>
        </div>

        <div class="form-group">
          <label>Role</label>
          <select v-model="form.role" required :disabled="loading" class="search-input" style="width: 100%;">
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="admin">Admin</option>
          </select>
          <span v-if="errors.role" class="text-error">{{ errors.role[0] }}</span>
        </div>

        <div class="form-group">
          <label>Password (Leave blank to keep current)</label>
          <input type="password" v-model="form.password" placeholder="••••••••" :disabled="loading">
          <span v-if="errors.password" class="text-error">{{ errors.password[0] }}</span>
        </div>

        <div class="modal-actions">
          <router-link to="/admin/user" class="btn-secondary">Cancel</router-link>
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
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import AdminCard from '../../components/AdminCard.vue';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const fetching = ref(true);
const errorMsg = ref('');
const errors = reactive({});

const form = reactive({
  name: '',
  email: '',
  phone: '',
  role: 'user',
  password: ''
});

async function fetchUser() {
  try {
    const response = await axios.get(`/api/v1/admin/users/${route.params.id}/edit`);
    if (response.data.success) {
      const u = response.data.data;
      form.name = u.name;
      form.email = u.email;
      form.phone = u.phone || '';
      form.role = u.role;
    }
  } catch (error) {
    console.error('Failed to fetch user:', error);
    errorMsg.value = 'Failed to load user data.';
  } finally {
    fetching.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  errorMsg.value = '';
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const response = await axios.put(`/api/v1/admin/users/${route.params.id}`, form);
    if (response.data.success) {
      router.push('/admin/user');
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      Object.assign(errors, error.response.data.errors);
    } else {
      errorMsg.value = 'Failed to update user. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchUser);
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
