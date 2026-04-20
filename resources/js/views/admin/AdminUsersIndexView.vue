<template>
  <div class="content-section">
    <div class="section-header">
      <h1>Users Management</h1>
      <form @submit.prevent="fetchUsers(1)">
        <input type="text" v-model="searchQuery" placeholder="Search users..." class="search-input">
      </form>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th> 
            <th>Email</th>
            <th>Role</th>     
            <th>Date Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading" class="empty-state-row">
            <td colspan="6">Loading users...</td>
          </tr>
          <template v-else>
            <tr v-for="user in users" :key="user.id">
              <td>#{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <status-badge :status="user.role" type="role"></status-badge>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <router-link :to="`/admin/user/${user.id}/edit`" class="action-link">Edit</router-link>
                <button @click="deleteUser(user.id)" class="action-link delete">Delete</button>
              </td>
            </tr>
            <tr v-if="users.length === 0" class="empty-state-row">
              <td colspan="6">No users found.</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination-wrapper">
      <nav class="pagination">
        <button 
          @click="fetchUsers(pagination.current_page - 1)" 
          :disabled="pagination.current_page === 1"
          class="btn-secondary btn-sm"
        >
          Previous
        </button>
        <span class="p-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        <button 
          @click="fetchUsers(pagination.current_page + 1)" 
          :disabled="pagination.current_page === pagination.last_page"
          class="btn-secondary btn-sm"
        >
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import StatusBadge from '../../components/StatusBadge.vue';

const users = ref([]);
const loading = ref(true);
const searchQuery = ref('');
const pagination = ref({
  current_page: 1,
  last_page: 1,
  total: 0
});
let searchTimeout = null;

async function fetchUsers(page = 1) {
  loading.value = true;
  try {
    const response = await axios.get('/api/v1/admin/users', {
      params: { 
        page,
        search: searchQuery.value
      }
    });
    users.value = response.data.data;
    pagination.value = {
      current_page: response.data.current_page,
      last_page: response.data.last_page,
      total: response.data.total
    };
  } catch (error) {
    console.error('Failed to fetch users:', error);
  } finally {
    loading.value = false;
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;
  try {
    const response = await axios.delete(`/api/v1/admin/users/${id}`);
    if (response.data.success) {
      fetchUsers(pagination.value.current_page);
    }
  } catch (error) {
    alert('Failed to delete user.');
  }
}

watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUsers(1);
  }, 300);
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
}

onMounted(() => fetchUsers());
</script>

<style scoped>
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
</style>
