<template>
    <footer>
        <p>{{ year }} {{ text }}</p>
    </footer>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    year: {
        type: [String, Number],
        default: new Date().getFullYear()
    },
    text: {
        type: String,
        default: 'Copyright. All rights reserved.'
    }
});
</script>

<style scoped>
/*
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  height: 10vh;
  background: rgba(30, 30, 30, 0.95);
  color: #aaa;
  border-top: 1px solid rgba(167, 139, 250, 0.3);
}
*/
</style>
