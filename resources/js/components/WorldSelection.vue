<template>
    <div class="world-selection">
        <div 
            v-for="item in items" 
            :key="item.slug"
            class="world-card"
            :class="{ 'selected': serviceStore.worlds.includes(item.name) }"
            @click="serviceStore.toggleWorld(item.name)"
        >
            <div class="world-label">{{ item.name }}</div>
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
/* Core styles inherited from services.css */
</style>
