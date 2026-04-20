<template>
    <button 
        type="button" 
        :class="['service-btn', { 'selected': isActive }]"
        @click="select"
    >
        <span>{{ label }}</span>
        <span class="price">₱{{ price }}</span>
    </button>
</template>

<script setup>
import { computed } from 'vue';
import { serviceStore } from '../stores/serviceStore';

const props = defineProps({
    category: String,
    service: String,
    price: Number,
    label: String
});

const isActive = computed(() => {
    return serviceStore.selectedServices[props.category]?.id === props.service;
});

function select() {
    serviceStore.toggleService(props.category, props.service, props.price, props.label);
}
</script>
