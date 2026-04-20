<template>
  <div class="auth-container">
    <div class="promo-panel">
      <slot name="promo"></slot>
    </div>

    <div class="form-panel">
      <slot name="form"></slot>
    </div>
  </div>
</template>

<script setup>
/**
 * AuthCard component provides a standardized layout for authentication pages.
 * It uses CSS classes defined in auth.css to maintain a split-panel design.
 */
</script>

<style scoped>
/* Core styles are defined in auth.css */
</style>
