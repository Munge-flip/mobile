import { reactive, computed } from 'vue';
import axios from 'axios';

export const serviceStore = reactive({
    game: '', 
    allServices: [], // Raw data from API
    loading: false,
    selectedServices: {}, 
    explorations: [],      
    worlds: [],            
    hollowModes: [],       
    paymentMethod: '',
    
    // Slugs from ServiceSeeder that should be multiplied
    multiplierCategories: [
        'waypoints', 'chest', 'oculi', 'completion', 
        'simulated-clear', 'divergent', 'hollow-zero'
    ],

    // Actions
    async fetchServices(gameName) {
        this.loading = true;
        
        // Reset selection if changing games
        if (this.game !== gameName) {
            this.resetSelection();
        }
        
        this.game = gameName;
        try {
            const response = await axios.get('/api/v1/services', {
                params: { 
                    game: gameName,
                    is_active: 1
                }
            });
            if (response.data.success) {
                this.allServices = response.data.data;
            }
        } catch (error) {
            console.error('Failed to fetch services:', error);
        } finally {
            this.loading = false;
        }
    },

    toggleService(category, serviceId, price, label) {
        if (this.selectedServices[category] && this.selectedServices[category].id === serviceId) {
            delete this.selectedServices[category];
        } else {
            this.selectedServices[category] = { name: label, price: price, id: serviceId };
        }
    },

    toggleRegion(regionName) {
        const index = this.explorations.indexOf(regionName);
        if (index > -1) this.explorations.splice(index, 1);
        else this.explorations.push(regionName);
    },

    toggleWorld(worldName) {
        const index = this.worlds.indexOf(worldName);
        if (index > -1) this.worlds.splice(index, 1);
        else this.worlds.push(worldName);
    },

    toggleMode(modeName) {
        const index = this.hollowModes.indexOf(modeName);
        if (index > -1) this.hollowModes.splice(index, 1);
        else this.hollowModes.push(modeName);
    },

    resetSelection() {
        this.selectedServices = {};
        this.explorations = [];
        this.worlds = [];
        this.hollowModes = [];
        this.paymentMethod = '';
    },

    // Getters
    getServicesByCategory(categoryName) {
        return this.allServices.filter(s => s.category_name === categoryName);
    },

    // Computed
    totalPriceRaw: computed(() => {
        let total = 0;
        const regionCount = serviceStore.explorations.length || 1;
        const worldCount = serviceStore.worlds.length || 1;
        const modeCount = serviceStore.hollowModes.length || 1;
        
        Object.keys(serviceStore.selectedServices).forEach(cat => {
            const item = serviceStore.selectedServices[cat];
            let multiplier = 1;
            
            if (serviceStore.multiplierCategories.includes(cat)) {
                if (cat === 'simulated-clear' && serviceStore.worlds.length > 0) {
                    multiplier = worldCount;
                } else if (cat === 'hollow-zero' && serviceStore.hollowModes.length > 0) {
                    multiplier = modeCount;
                } else if (serviceStore.explorations.length > 0) {
                    multiplier = regionCount;
                }
            }
            total += (item.price * multiplier);
        });
        return total;
    }),

    categoryString: computed(() => {
        return Object.keys(serviceStore.selectedServices).join(', ');
    }),

    serviceTypeString: computed(() => {
        const names = Object.values(serviceStore.selectedServices).map(s => s.name);
        let str = names.join(', ');
        const extras = [...serviceStore.explorations, ...serviceStore.worlds, ...serviceStore.hollowModes];
        if (extras.length > 0) {
            str += ` (${extras.join(', ')})`;
        }
        return str;
    })
});
