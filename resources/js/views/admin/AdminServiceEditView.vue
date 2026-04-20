<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Edit Service</h1>
      <router-link to="/admin/services" class="action-link">
        ← Back to Services
      </router-link>
    </div>

    <div v-if="fetching" class="text-center p-10">
      <p>Loading service details...</p>
    </div>

    <admin-card v-else title="Service Information" :use-body="false">
      <div v-if="errorMsg" class="alert-error">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label>Game <span style="color: red;">*</span></label>
          <select v-model="form.game" required class="search-input" style="width: 100%;">
            <option value="">Select Game</option>
            <option value="Genshin Impact">Genshin Impact</option>
            <option value="Honkai Star Rail">Honkai Star Rail</option>
            <option value="Zenless Zone Zero">Zenless Zone Zero</option>
          </select>
          <span v-if="errors.game" class="text-error">{{ errors.game[0] }}</span>
        </div>

        <div class="form-group">
          <label>Category <span style="color: red;">*</span></label>
          <select v-model="form.category" required class="search-input" style="width: 100%;">
            <option value="">Select Category</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Quests">Quests</option>
            <option value="Events">Events</option>
            <option value="Endgame">Endgame</option>
            <option value="Exploration">Exploration</option>
            <option value="Special">Special</option>
          </select>
          <span v-if="errors.category" class="text-error">{{ errors.category[0] }}</span>
        </div>

        <div class="form-group">
          <label>Service Name <span style="color: red;">*</span></label>
          <input type="text" v-model="form.name" required>
          <span v-if="errors.name" class="text-error">{{ errors.name[0] }}</span>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" rows="3" class="search-input" 
                    style="width: 100%; resize: vertical;"></textarea>
          <span v-if="errors.description" class="text-error">{{ errors.description[0] }}</span>
        </div>

        <div class="form-group">
          <label>Price (₱) <span style="color: red;">*</span></label>
          <input type="number" v-model="form.price" required min="0" step="0.01">
          <span v-if="errors.price" class="text-error">{{ errors.price[0] }}</span>
        </div>

        <div class="form-group">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
            <input type="checkbox" v-model="form.is_active">
            <span>Active (Service available to users)</span>
          </label>
        </div>

        <div class="modal-actions">
          <router-link to="/admin/services" class="btn-secondary">Cancel</router-link>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Saving...' : 'Update Service' }}
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
  game: '',
  category: '',
  name: '',
  description: '',
  price: 0,
  is_active: true
});

async function fetchService() {
  try {
    const response = await axios.get(`/api/v1/admin/services/${route.params.id}/edit`);
    if (response.data.success) {
      const s = response.data.data;
      form.game = s.game;
      form.category = s.category_name; // Use display name for the form dropdown
      form.name = s.name;
      form.description = s.description || '';
      form.price = Number(s.price);
      form.is_active = !!s.is_active;
    }
  } catch (error) {
    console.error('Failed to fetch service:', error);
    errorMsg.value = 'Failed to load service data.';
  } finally {
    fetching.value = false;
  }
}

async function handleSubmit() {
  loading.value = true;
  errorMsg.value = '';
  Object.keys(errors).forEach(key => delete errors[key]);

  try {
    const response = await axios.put(`/api/v1/admin/services/${route.params.id}`, form);
    if (response.data.success) {
      router.push('/admin/services');
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      Object.assign(errors, error.response.data.errors);
    } else {
      errorMsg.value = 'Failed to update service. Please try again.';
    }
  } finally {
    loading.value = false;
  }
}

onMounted(fetchService);
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
