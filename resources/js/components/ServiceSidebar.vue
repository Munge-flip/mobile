<template>
  <div class="service-sidebar-content">
    <div class="game-info">
      <img :src="gameIcon" :alt="gameName" class="game-icon">
      <h2>{{ gameName }}</h2>
    </div>

    <div class="how-to-order">
      <h3>{{ instructionTitle }}</h3>
      <ol>
        <li v-for="(instruction, index) in displayInstructions" :key="index">
          {{ instruction }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  gameIcon: { type: String, required: true },
  gameName: { type: String, required: true },
  instructionTitle: { type: String, default: 'How to order' },
  customInstructions: { type: Array, default: null }
});

const defaultInstructions = [
  'Select the service you want.',
  'Complete your payment.',
  'The service will be added to your service catalog.',
  'We will contact you when we are ready to do the service and ask a few questions before proceeding.'
];

const displayInstructions = computed(() => {
  return props.customInstructions || defaultInstructions;
});
</script>

<style scoped>
/* Inherits from services.css */
</style>
