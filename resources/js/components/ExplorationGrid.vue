<template>
    <div class="exploration-grid">
        <div 
            v-for="region in regions" 
            :key="region.slug"
            class="exploration-card"
            :class="{ 'selected': serviceStore.explorations.includes(region.name) }"
            @click="selectRegion(region)"
        >
            <div 
                class="exploration-image" 
                :style="{ backgroundImage: `url('/img/${region.slug} banner.png')` }"
            ></div>
            <h4>{{ region.name }}</h4>
        </div>
    </div>
</template>

<script setup>
import { serviceStore } from '../stores/serviceStore';

const props = defineProps({
    regions: Array
});

function selectRegion(region) {
    serviceStore.toggleRegion(region.name);
}
</script>
