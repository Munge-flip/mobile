<template>
  <div class="stat-card">
    <div class="stat-icon" :class="iconClass" :style="iconColor ? `background: ${iconColor};` : ''">
      <slot name="icon"></slot>
    </div>
    <div class="stat-info">
      <h3>{{ title }}</h3>
      <p class="stat-number">
        <template v-if="isCurrency">₱</template>{{ formattedNumber }}
      </p>
      <span class="stat-trend" :class="{ 'up': isTrendUp }">{{ trend }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  number: { type: [Number, String], required: true },
  trend: { type: String, default: '' },
  iconClass: { type: String, default: '' },
  iconColor: { type: String, default: '' },
  isCurrency: { type: Boolean, default: false },
  isTrendUp: { type: Boolean, default: false }
});

const formattedNumber = computed(() => {
  if (props.isCurrency && !isNaN(props.number)) {
    return Number(props.number).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  return props.number;
});
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>