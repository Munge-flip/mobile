<template>
  <div class="detail-row" :class="{ 'align-center': alignCenter }">
    <span class="label">{{ label }}:</span>
    <div v-if="$slots.default" class="flex-row-gap">
      <slot></slot>
    </div>
    <strong v-else-if="!isPrice" :class="valueClass">{{ value }}</strong>
    <span v-else class="price" :class="valueClass">₱{{ formatPrice(value) }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], default: '' },
  isPrice: { type: Boolean, default: false },
  alignCenter: { type: Boolean, default: false },
  valueClass: { type: String, default: '' }
});

const formatPrice = (val) => {
  return Number(val).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
</script>

<style scoped>
/* Inheriting from dashboard.css */
</style>