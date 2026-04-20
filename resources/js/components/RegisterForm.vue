<template>
  <div class="form-content active">
    <div v-if="errorMsg" class="alert-error">
      {{ errorMsg }}
    </div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <input 
          type="text" 
          placeholder="Name" 
          required 
          v-model="name"
          :class="{ 'has-error': errors.name }"
          :disabled="loading"
        >
        <span v-if="errors.name" class="text-error">{{ errors.name[0] }}</span>
      </div>

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
          type="tel" 
          placeholder="Phone Number" 
          required 
          v-model="phone"
          :class="{ 'has-error': errors.phone }"
          :disabled="loading"
        >
        <span v-if="errors.phone" class="text-error">{{ errors.phone[0] }}</span>
      </div>

      <div class="form-group">
        <input 
          type="password" 
          placeholder="Password" 
          required 
          v-model="password"
          :class="{ 'has-error': errors.password }"
          :disabled="loading"
        >
        <span v-if="errors.password" class="text-error">{{ errors.password[0] }}</span>
      </div>

      <div class="form-group">
        <input 
          type="password" 
          placeholder="Confirm Password" 
          required 
          v-model="passwordConfirmation"
          :disabled="loading"
        >
      </div>

      <button type="submit" class="submit-btn" :disabled="loading">
        {{ loading ? 'Signing up...' : 'Sign Up' }}
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
const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const errorMsg = ref('');
const errors = reactive({});

async function handleRegister() {
    loading.value = true;
    errorMsg.value = '';
    Object.keys(errors).forEach(key => delete errors[key]);

    try {
        const response = await axios.post('/api/v1/register', {
            name: name.value,
            email: email.value,
            phone: phone.value,
            password: password.value,
            password_confirmation: passwordConfirmation.value
        });

        if (response.data.success) {
            // Update reactive auth store
            const { user, token } = response.data.data;
            authStore.setUser(user, token);
            
            // Redirect to landing page
            const redirectPath = response.data.redirect || '/';
            
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
