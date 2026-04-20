<template>
  <auth-card>
    <template #promo>
      <h2>NEED AN ACCOUNT?</h2>
      <p>Sign up an account and enjoy the services with Hoyo Piloting service</p>
      <router-link to="/register" class="submit-btn" style="text-decoration: none; display: inline-block; line-height: normal; text-align: center;">
        Create Account
      </router-link>
    </template>

    <template #form>
      <h2>SIGN IN</h2>
      <login-form></login-form>
    </template>
  </auth-card>
</template>

<script setup>
import AuthCard from '../../components/AuthCard.vue';
import LoginForm from '../../components/LoginForm.vue';
</script>

<style scoped>
/* Scoped styles specific to the view */
</style>
