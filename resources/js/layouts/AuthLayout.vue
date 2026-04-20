<template>
  <div id="auth-layout" class="auth-page-wrapper">
    <router-view />
  </div>
</template>

<script setup>
// Layout for Login/Register
</script>

<style>
/* 
   We use a non-scoped style here to ensure the body background 
   is correctly applied across the auth pages. 
*/
@import '../../css/auth.css';

.auth-page-wrapper {
  background: #1E222A;
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
