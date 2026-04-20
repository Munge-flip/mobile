import { reactive } from 'vue';
import axios from 'axios';

export const authStore = reactive({
    user: window.User || null,
    loading: false,
    initialized: false,

    async init() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            try {
                this.loading = true;
                const response = await axios.get('/api/me');
                if (response.data.success) {
                    this.user = response.data.data;
                    window.User = this.user;
                } else {
                    this.logout();
                }
            } catch (error) {
                console.error('Session restoration failed:', error);
                this.logout();
            } finally {
                this.loading = false;
            }
        }
        this.initialized = true;
    },

    setUser(user, token) {
        this.user = user;
        window.User = user;
        if (token) {
            localStorage.setItem('auth_token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    },

    async logout() {
        try {
            await axios.post('/api/logout');
        } catch (e) {
            // Ignore logout failure
        }
        this.user = null;
        window.User = null;
        localStorage.removeItem('auth_token');
        delete axios.defaults.headers.common['Authorization'];
    }
});
