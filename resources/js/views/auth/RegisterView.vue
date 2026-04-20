<template>
  <auth-card>
    <template #promo>
      <h2>ALREADY HAVE AN ACCOUNT?</h2>
      <p>Sign in to our account and enjoy your service with Hoyo Piloting service</p>
      <router-link to="/login" class="submit-btn" style="text-decoration: none; display: inline-block; line-height: normal; text-align: center;">
        Sign In
      </router-link>
    </template>

    <template #form>
      <h2>SIGN UP</h2>
      <register-form></register-form>
    </template>
  </auth-card>
</template>

<script setup>
import AuthCard from '../../components/AuthCard.vue';
import RegisterForm from '../../components/RegisterForm.vue';
</script>

<style scoped>
/* Scoped styles specific to the view */
</style>
