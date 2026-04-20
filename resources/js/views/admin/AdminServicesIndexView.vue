<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Service Management</h1>
      <router-link to="/admin/services/create" class="btn-primary">
        + Add New Service
      </router-link>
    </div>

    <!-- Filters -->
    <div class="filters-container">
      <form @submit.prevent="fetchServices(1)" class="filter-form">
        <input type="text" v-model="filters.search" placeholder="Search by name..." class="search-input flex-1">
        
        <select v-model="filters.game" class="search-input w-200">
          <option value="">All Games</option>
          <option value="Genshin Impact">Genshin Impact</option>
          <option value="Honkai Star Rail">Honkai Star Rail</option>
          <option value="Zenless Zone Zero">Zenless Zone Zero</option>
        </select>

        <select v-model="filters.category" class="search-input w-200">
          <option value="">All Categories</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Quests">Quests</option>
          <option value="Events">Events</option>
          <option value="Endgame">Endgame</option>
          <option value="Exploration">Exploration</option>
        </select>

        <button type="submit" class="btn-primary">Filter</button>
        <button type="button" @click="clearFilters" class="btn-secondary">Clear</button>
      </form>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Game</th>
            <th>Category</th>
            <th>Service Name</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="empty-state-row">
            <td colspan="8">Loading services...</td>
          </tr>
          <template v-else>
            <tr v-for="service in services" :key="service.id">
              <td>#{{ service.id }}</td>
              <td>{{ service.game }}</td>
              <td>{{ service.category_name }}</td>
              <td>{{ service.name }}</td>
              <td>₱{{ formatPrice(service.price) }}</td>
              <td>
                <status-badge :status="service.is_active ? 'active' : 'inactive'" type="service"></status-badge>
              </td>
              <td>{{ formatDate(service.created_at) }}</td>
              <td>
                <router-link :to="`/admin/services/${service.id}/edit`" class="action-link">Edit</router-link>
                
                <button @click="toggleStatus(service)" class="action-link" 
                        :style="{ color: service.is_active ? '#e74c3c' : '#27ae60' }">
                  {{ service.is_active ? 'Deactivate' : 'Activate' }}
                </button>

                <button @click="confirmDelete(service)" class="action-link delete">Delete</button>
              </td>
            </tr>
            <tr v-if="services.length === 0" class="empty-state-row">
              <td colspan="8">No services found.</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination-wrapper">
      <nav class="pagination">
        <button 
          @click="fetchServices(pagination.current_page - 1)" 
          :disabled="pagination.current_page === 1"
          class="btn-secondary btn-sm"
        >
          Previous
        </button>
        <span class="p-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button 
          @click="fetchServices(pagination.current_page + 1)" 
          :disabled="pagination.current_page === pagination.last_page"
          class="btn-secondary btn-sm"
        >
          Next
        </button>
      </nav>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal" style="display: block;">
      <div class="modal-content modal-small">
        <div class="modal-header">
          <h2>Delete Service?</h2>
          <span class="close-modal" @click="showDeleteModal = false">&times;</span>
        </div>
        <div class="modal-body text-center" style="padding: 30px;">
          <p class="mb-20">Are you sure you want to delete <strong>{{ serviceToDelete?.name }}</strong>? This action cannot be undone.</p>
          <div class="modal-actions" style="display: flex; gap: 10px;">
            <button type="button" @click="showDeleteModal = false" class="btn-secondary flex-1">
              Cancel
            </button>
            <button type="button" @click="handleDelete" class="btn-danger flex-1" :disabled="deleting">
              {{ deleting ? 'Deleting...' : 'Yes, Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import StatusBadge from '../../components/StatusBadge.vue';

const services = ref([]);
const loading = ref(true);
const filters = reactive({
  search: '',
  game: '',
  category: ''
});
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
});

// Delete Modal State
const showDeleteModal = ref(false);
const serviceToDelete = ref(null);
const deleting = ref(false);

async function fetchServices(page = 1) {
  loading.value = true;
  try {
    const response = await axios.get('/api/v1/admin/services', {
      params: { 
        page,
        search: filters.search,
        game: filters.game,
        category: filters.category
      }
    });
    // Paginator response
    services.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total
    };
  } catch (error) {
    console.error('Failed to fetch services:', error);
  } finally {
    loading.value = false;
  }
}

function clearFilters() {
  filters.search = '';
  filters.game = '';
  filters.category = '';
  fetchServices(1);
}

async function toggleStatus(service) {
  try {
    const response = await axios.patch(`/api/v1/admin/services/${service.id}/toggle`);
    if (response.data.success) {
      service.is_active = response.data.is_active;
    }
  } catch (error) {
    alert('Failed to update status.');
  }
}

function confirmDelete(service) {
  serviceToDelete.value = service;
  showDeleteModal.value = true;
}

async function handleDelete() {
  if (!serviceToDelete.value) return;
  deleting.value = true;
  try {
    const response = await axios.delete(`/api/v1/admin/services/${serviceToDelete.value.id}`);
    if (response.data.success) {
      showDeleteModal.value = false;
      fetchServices(pagination.value.current_page);
    }
  } catch (error) {
    alert('Failed to delete service.');
  } finally {
    deleting.value = false;
    serviceToDelete.value = null;
  }
}

function formatPrice(val) {
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

onMounted(() => fetchServices());
</script>

<style scoped>
.filters-container {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
}
.filter-form {
  display: flex;
  gap: 10px;
  align-items: center;
}
.w-200 { width: 200px; }
.flex-1 { flex: 1; }
.action-link {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
  margin-right: 10px;
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Modal Styles */
.modal {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 0;
  border-radius: 15px;
  overflow: hidden;
  max-width: 400px;
  width: 90%;
}
.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close-modal {
  cursor: pointer;
  font-size: 24px;
}
.modal-body {
  padding: 20px;
}
.mb-20 { margin-bottom: 20px; }
.flex-1 { flex: 1; }
</style>
