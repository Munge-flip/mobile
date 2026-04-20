import './bootstrap';
import { createApp } from 'vue';
import { serviceStore } from './stores/serviceStore';
import { authStore } from './stores/authStore';
import router from './router';
import App from './App.vue';

// Components
import ExampleComponent from './components/ExampleComponent.vue';
import ServiceCard from './components/ServiceCard.vue';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AppSidebar from './components/AppSidebar.vue';
import ServiceButton from './components/ServiceButton.vue';
import ServiceCategory from './components/ServiceCategory.vue';
import ExplorationGrid from './components/ExplorationGrid.vue';
import WorldSelection from './components/WorldSelection.vue';
import ModeSelection from './components/ModeSelection.vue';
import PaymentSection from './components/PaymentSection.vue';
import OrderSummary from './components/OrderSummary.vue';
import AuthCard from './components/AuthCard.vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import InfoCard from './components/InfoCard.vue';
import DetailRow from './components/DetailRow.vue';
import StatusBadge from './components/StatusBadge.vue';
import ProfileCard from './components/ProfileCard.vue';
import StatCard from './components/StatCard.vue';
import AgentCard from './components/AgentCard.vue';
import AdminCard from './components/AdminCard.vue';
import AgentProfileCard from './components/AgentProfileCard.vue';
import AdminDashboardOverview from './components/AdminDashboardOverview.vue';
import OrderHistoryList from './components/OrderHistoryList.vue';
import AdminOrderTable from './components/AdminOrderTable.vue';
import AdminTransactionTable from './components/AdminTransactionTable.vue';
import AdminOrderDetails from './components/AdminOrderDetails.vue';
import ChatBox from './components/ChatBox.vue';
import ServiceCatalogLoader from './components/ServiceCatalogLoader.vue';
import ServiceSidebar from './components/ServiceSidebar.vue';

async function initApp() {
    // Re-hydrate session
    await authStore.init();

    const app = createApp(App);

    // Setup Stores
    app.provide('serviceStore', serviceStore);
    app.provide('authStore', authStore);

    // Use Router
    app.use(router);

    // Register All Components
    app.component('example-component', ExampleComponent);
    app.component('service-card', ServiceCard);
    app.component('app-header', AppHeader);
    app.component('app-footer', AppFooter);
    app.component('app-sidebar', AppSidebar);
    app.component('service-button', ServiceButton);
    app.component('service-category', ServiceCategory);
    app.component('exploration-grid', ExplorationGrid);
    app.component('world-selection', WorldSelection);
    app.component('mode-selection', ModeSelection);
    app.component('payment-section', PaymentSection);
    app.component('order-summary', OrderSummary);
    app.component('auth-card', AuthCard);
    app.component('login-form', LoginForm);
    app.component('register-form', RegisterForm);
    app.component('info-card', InfoCard);
    app.component('detail-row', DetailRow);
    app.component('status-badge', StatusBadge);
    app.component('profile-card', ProfileCard);
    app.component('stat-card', StatCard);
    app.component('agent-card', AgentCard);
    app.component('admin-card', AdminCard);
    app.component('agent-profile-card', AgentProfileCard);
    app.component('admin-dashboard-overview', AdminDashboardOverview);
    app.component('order-history-list', OrderHistoryList);
    app.component('admin-order-table', AdminOrderTable);
    app.component('admin-transaction-table', AdminTransactionTable);
    app.component('admin-order-details', AdminOrderDetails);
    app.component('chat-box', ChatBox);
    app.component('service-catalog-loader', ServiceCatalogLoader);
    app.component('service-sidebar', ServiceSidebar);

    app.mount('#app');
}

initApp();
