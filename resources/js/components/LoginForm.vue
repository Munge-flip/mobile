<template>
  <div class="form-content active">
    <div v-if="errorMsg" class="alert-error">
      {{ errorMsg }}
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <input 
          type="email" 
          placeholder="Email" 
          required 
          v-model="email"
          :class="{ 'has-error': errors.email }"
          :disabled="loading"
        >
        <span v-if="errors.email" class="text-error">{{ errors.email[0] }}</span>
      </div>
      
      <div class="form-group">
        <input 
          type="password" 
          placeholder="Password" 
          required 
          v-model="password"
          :disabled="loading"
        >
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { authStore } from '../stores/authStore';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const errorMsg = ref('');
const errors = reactive({});

async function handleLogin() {
    loading.value = true;
    errorMsg.value = '';
    Object.keys(errors).forEach(key => delete errors[key]);

    try {
        const response = await axios.post('/api/v1/login', {
            email: email.value,
            password: password.value
        });

        if (response.data.success) {
            // Update reactive auth store
            authStore.setUser(response.data.data.user, response.data.data.token);

            // Derive redirect
            const userData = response.data.data.user;
            const redirectPath = response.data.redirect || 
                                (userData.role === 'admin' ? '/admin' : 
                                (userData.role === 'agent' ? '/agent' : '/'));

            // Smooth SPA navigation
            router.push(redirectPath);
        }
    } catch (error) {
        if (error.response && error.response.status === 422) {
            Object.assign(errors, error.response.data.errors);
            errorMsg.value = error.response.data.message;
        } else {
            errorMsg.value = 'An unexpected error occurred. Please try again.';
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.text-error {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 5px;
  margin-left: 20px;
  display: block;
}
</style>
