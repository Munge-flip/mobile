<template>
    <div class="p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg">
        <h2 class="text-xl font-bold">Vue.js Integrated!</h2>
        <p>This is a Vue component rendered in a Laravel project.</p>
        <button @click="count++" class="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            Count: {{ count }}
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<style scoped>
</style>
