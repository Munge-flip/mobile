<template>
  <div class="service-view">
    <div class="service-section">
      <h2>Choose a service</h2>

      <!-- Standard Categories -->
      <service-category title="Maintenance" api-category="Maintenance"></service-category>
      <service-category title="Regular Quests" api-category="Regular Quests"></service-category>
      <service-category title="Events" api-category="Events"></service-category>
      <service-category title="Endgame" api-category="Endgame"></service-category>

      <!-- Simulated Universe -->
      <service-category title="Simulated Universe" description="Choose a World" api-category="Simulated Universe">
        <world-selection :items="[
          {'slug': 'swarm-disaster', 'name': 'Swarm Disaster'},
          {'slug': 'gold-gears', 'name': 'Gold and Gears'},
          {'slug': 'unknowable-domain', 'name': 'Unknowable Domain'},
        ]"></world-selection>
      </service-category>

      <!-- Divergent Universe -->
      <service-category title="Divergent Universe" api-category="Divergent Universe"></service-category>

      <!-- Explorations -->
      <service-category title="Explorations" description="Select regions for your services" :custom-layout="true">
        <exploration-grid :regions="[
          {'slug': 'herta-space-station', 'name': 'Herta Space Station'},
          {'slug': 'jarilo', 'name': 'Jarilo-VI'},
          {'slug': 'xianzhou', 'name': 'Xianzhou Luofu'},
          {'slug': 'penacony', 'name': 'Penacony'},
          {'slug': 'amphoreus', 'name': 'Amphoreus'},
        ]"></exploration-grid>
      </service-category>

      <!-- 100% Area Completion -->
      <service-category title="100% Area Completion" api-category="100% Area Completion"></service-category>
    </div>

    <!-- Payment and Summary -->
    <payment-section></payment-section>
    <order-summary></order-summary>
  </div>
</template>

<script setup>
// HSR Service View
</script>

<style scoped>
/* Inherits from services.css via app.css */
</style>
