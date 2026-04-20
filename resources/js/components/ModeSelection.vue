<template>
    <div class="mode-selection">
        <div 
            v-for="item in items" 
            :key="item.slug"
            class="mode-card"
            :class="{ 'selected': serviceStore.hollowModes.includes(item.name) }"
            @click="serviceStore.toggleMode(item.name)"
        >
            <div class="mode-label">{{ item.name }}</div>
        </div>
    </div>
</template>

<script setup>
import { serviceStore } from '../stores/serviceStore';

defineProps({
    items: Array
});
</script>

<style scoped>
/* Inheriting core styles from services.css */
</style>
