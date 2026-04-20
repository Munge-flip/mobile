<template>
  <div class="service-view">
    <div class="service-section">
      <h2>Choose a service</h2>

      <!-- Standard Categories (API DRIVEN) -->
      <service-category title="Maintenance" api-category="Maintenance"></service-category>
      <service-category title="Regular Quests" api-category="Regular Quests"></service-category>
      <service-category title="Events" api-category="Events"></service-category>
      <service-category title="Endgame" api-category="Endgame"></service-category>

      <!-- Explorations -->
      <service-category 
        title="Explorations" 
        description="Select regions for your services"
        :custom-layout="true"
      >
        <exploration-grid :regions="[
          {'slug': 'mondstadt', 'name': 'Mondstadt'},
          {'slug': 'liyue', 'name': 'Liyue'},
          {'slug': 'inazuma', 'name': 'Inazuma'},
          {'slug': 'fontaine', 'name': 'Fontaine'},
          {'slug': 'natlan', 'name': 'Natlan'},
          {'slug': 'nod-krai', 'name': 'Nod Krai'},
        ]"></exploration-grid>
      </service-category>

      <!-- Farming Categories (API DRIVEN) -->
      <service-category title="Unlocking Waypoints & Statues" api-category="Unlocking Waypoints & Statues"></service-category>
      <service-category title="Chest Farming" api-category="Chest Farming"></service-category>
      <service-category title="Collecting oculi" api-category="Collecting oculi"></service-category>
      <service-category title="100% Area Completion" api-category="100% Area Completion"></service-category>
    </div>

    <!-- Payment and Summary -->
    <payment-section></payment-section>
    <order-summary></order-summary>
  </div>
</template>

<script setup>
// This view is rendered inside ServiceLayout
</script>

<style scoped>
/* Inherits from services.css via app.css */
</style>
