<template>
    <div :class="['frame', customClass]">
        <router-link :to="link">
            <section :class="['label', labelClass]">{{ title }}</section>
            <img :src="image" :alt="title" :class="imageClass" />
        </router-link>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: '#'
    },
    customClass: {
        type: String,
        default: ''
    },
    labelClass: {
        type: String,
        default: ''
    },
    imageClass: {
        type: String,
        default: ''
    }
});
</script>

<style scoped>
/* We keep the styles scoped to this component if we want, 
   but since they are already in app.css, we can rely on global styles for now 
   to ensure the 'look' stays identical during migration. */
</style>
