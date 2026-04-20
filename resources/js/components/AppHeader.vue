<template>
    <header>
        <nav>
            <div class="weblogo-container">
                <div class="weblogo-frame">
                    <router-link :to="homeUrl">
                        <img :src="logoUrl" alt="Logo" class="logo" />
                    </router-link>
                </div>
            </div>
            
            <div v-if="roleInfo" class="admin-info">
                <span>{{ roleInfo }}</span>
            </div>

            <ul>
                <li v-for="link in navLinks" :key="link.url">
                    <router-link 
                        :to="link.url" 
                        :class="[link.class || '', { 'active': isLinkActive(link) }]" 
                    >
                        {{ link.label }}
                    </router-link>
                </li>
                
                <li v-if="authStore.user">
                    <button @click="authStore.logout().then(() => router.push('/login'))" class="logout-btn" :disabled="authStore.loading">
                        {{ authStore.loading ? 'Logging out...' : 'Logout' }}
                    </button>
                </li>
            </ul>
        </nav>
    </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { authStore } from '../stores/authStore';

const props = defineProps({
    logoUrl: { type: String, default: '/img/weblogo.png' },
    homeUrl: { type: String, default: '/' },
    isLoggedIn: { type: Boolean, default: false }, // Kept for prop compatibility
    navLinks: {
        type: Array,
        default: () => []
    },
    roleInfo: { type: String, default: '' }
});

const route = useRoute();
const router = useRouter();

function isLinkActive(link) {
    if (link.exact) {
        return route.path === link.url;
    }
    if (link.url === '/') return route.path === '/';
    return route.path.startsWith(link.url);
}
</script>

<style scoped>
header nav ul {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 20px;
}

header nav ul li a {
  text-decoration: none;
  font-size: 22px;
  color: #ffffff;
  transition: all 0.3s ease;
  padding: 8px 16px;
  border-radius: 4px;
}

header nav ul li a:hover,
header nav ul li a.active {
  color: #a78bfa;
  background-color: rgba(167, 139, 250, 0.1);
}

.logout-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  cursor: pointer;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
}

.admin-info {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
  flex: 1;
}
</style>
