<template>
  <div class="service-view">
    <div class="service-section">
      <h2>Choose a service</h2>

      <!-- Standard Categories -->
      <service-category title="Maintenance" api-category="Maintenance"></service-category>
      <service-category title="Regular Quests" api-category="Regular Quests"></service-category>
      <service-category title="Events" api-category="Events"></service-category>
      <service-category title="Endgame" api-category="Endgame"></service-category>

      <!-- Hollow Zero -->
      <service-category title="Hollow Zero" description="Choose a Mode" :custom-layout="true" api-category="Hollow Zero">
        <mode-selection :items="[
          {'slug': 'lost-void', 'name': 'Lost Void'},
          {'slug': 'withered-domain', 'name': 'Withered Domain'},
        ]"></mode-selection>
      </service-category>

      <!-- Explorations / Completion -->
      <service-category title="Explorations" :custom-layout="true" api-category="100% Area Completion"></service-category>
    </div>

    <!-- Payment and Summary -->
    <payment-section></payment-section>
    <order-summary></order-summary>
  </div>
</template>

<script setup>
// ZZZ Service View
</script>

<style scoped>
/* Inherits from services.css via app.css */
</style>
