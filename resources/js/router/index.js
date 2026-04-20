import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '../stores/authStore';

// Layouts
const PublicLayout = () => import('../layouts/PublicLayout.vue');
const AuthLayout = () => import('../layouts/AuthLayout.vue');
const ServiceLayout = () => import('../layouts/ServiceLayout.vue');
const UserLayout = () => import('../layouts/UserLayout.vue');
const AdminLayout = () => import('../layouts/AdminLayout.vue');
const AgentLayout = () => import('../layouts/AgentLayout.vue');

// Pages
const HomeView = () => import('../views/public/HomeView.vue');
const LoginView = () => import('../views/auth/LoginView.vue');
const RegisterView = () => import('../views/auth/RegisterView.vue');
const UnauthorizedView = () => import('../views/public/UnauthorizedView.vue');

// User Pages
const UserDashboardView = () => import('../views/user/UserDashboardView.vue');
const UserEditInfoView = () => import('../views/user/UserEditInfoView.vue');
const UserEditPasswordView = () => import('../views/user/UserEditPasswordView.vue');
const UserOrdersIndexView = () => import('../views/user/UserOrdersIndexView.vue');
const UserOrderShowView = () => import('../views/user/UserOrderShowView.vue');
const UserOrderChatView = () => import('../views/user/UserOrderChatView.vue');
const UserTransactionsIndexView = () => import('../views/user/UserTransactionsIndexView.vue');
const UserTransactionShowView = () => import('../views/user/UserTransactionShowView.vue');

// Admin Pages
const AdminDashboardView = () => import('../views/admin/AdminDashboardView.vue');
const AdminAgentsIndexView = () => import('../views/admin/AdminAgentsIndexView.vue');
const AdminAgentCreateView = () => import('../views/admin/AdminAgentCreateView.vue');
const AdminOrdersIndexView = () => import('../views/admin/AdminOrdersIndexView.vue');
const AdminOrderShowView = () => import('../views/admin/AdminOrderShowView.vue');
const AdminOrderChatView = () => import('../views/admin/AdminOrderChatView.vue');
const AdminProfileIndexView = () => import('../views/admin/AdminProfileIndexView.vue');
const AdminProfileEditView = () => import('../views/admin/AdminProfileEditView.vue');
const AdminProfilePasswordView = () => import('../views/admin/AdminProfilePasswordView.vue');
const AdminServicesIndexView = () => import('../views/admin/AdminServicesIndexView.vue');
const AdminServiceCreateView = () => import('../views/admin/AdminServiceCreateView.vue');
const AdminServiceEditView = () => import('../views/admin/AdminServiceEditView.vue');
const AdminTransactionsIndexView = () => import('../views/admin/AdminTransactionsIndexView.vue');
const AdminTransactionShowView = () => import('../views/admin/AdminTransactionShowView.vue');
const AdminUsersIndexView = () => import('../views/admin/AdminUsersIndexView.vue');
const AdminUserEditView = () => import('../views/admin/AdminUserEditView.vue');

// Agent Pages
const AgentDashboardView = () => import('../views/agent/AgentDashboardView.vue');
const AgentEditInfoView = () => import('../views/agent/AgentEditInfoView.vue');
const AgentEditPasswordView = () => import('../views/agent/AgentEditPasswordView.vue');
const AgentOrdersIndexView = () => import('../views/agent/AgentOrdersIndexView.vue');
const AgentOrderShowView = () => import('../views/agent/AgentOrderShowView.vue');
const AgentOrderChatView = () => import('../views/agent/AgentOrderChatView.vue');

// Service Views
const GenshinView = () => import('../views/public/GenshinView.vue');
const HsrView = () => import('../views/public/HsrView.vue');
const ZzzView = () => import('../views/public/ZzzView.vue');

const routes = [
    {
        path: '/',
        component: PublicLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: HomeView
            },
            {
                path: 'unauthorized',
                name: 'unauthorized',
                component: UnauthorizedView
            }
        ]
    },
    {
        path: '/services',
        component: ServiceLayout,
        children: [
            {
                path: 'genshin',
                name: 'services.genshin',
                component: GenshinView,
                meta: { 
                    title: 'Genshin Impact Services',
                    banner: '/img/genshin banner.png',
                    gameIcon: '/img/paimon logo.png',
                    gameName: 'Genshin Impact'
                }
            },
            {
                path: 'hsr',
                name: 'services.hsr',
                component: HsrView,
                meta: { 
                    title: 'Honkai Star Rail Services',
                    banner: '/img/hsr banner.png',
                    gameIcon: '/img/hsr icon.png',
                    gameName: 'Honkai Star Rail'
                }
            },
            {
                path: 'zzz',
                name: 'services.zzz',
                component: ZzzView,
                meta: { 
                    title: 'Zenless Zone Zero Services',
                    banner: '/img/zzz banner.png',
                    gameIcon: '/img/zzz icon.png',
                    gameName: 'Zenless Zone Zero',
                    customInstructions: [
                        'Select the service you want.',
                        'Complete your payment.',
                        'The service will be added to your service catalog.',
                        'Wait for an agent to confirm and ask a few questions before proceeding.'
                    ]
                }
            }
        ]
    },
    {
        path: '/user',
        component: UserLayout,
        meta: { requiresAuth: true, role: 'user' },
        children: [
            {
                path: '',
                name: 'user.dashboard',
                component: UserDashboardView
            },
            {
                path: 'edit',
                name: 'user.dashboard.edit',
                component: UserEditInfoView
            },
            {
                path: 'update',
                name: 'user.dashboard.update',
                component: UserEditPasswordView
            },
            {
                path: 'order',
                name: 'user.order',
                component: UserOrdersIndexView
            },
            {
                path: 'order/:id',
                name: 'user.order.show',
                component: UserOrderShowView
            },
            {
                path: 'order/:id/chat',
                name: 'user.order.chat',
                component: UserOrderChatView
            },
            {
                path: 'transactions',
                name: 'user.transactions',
                component: UserTransactionsIndexView
            },
            {
                path: 'transactions/:id',
                name: 'user.transactions.show',
                component: UserTransactionShowView
            }
        ]
    },
    {
        path: '/admin',
        component: AdminLayout,
        meta: { requiresAuth: true, role: 'admin' },
        children: [
            {
                path: '',
                name: 'admin.dashboard',
                component: AdminDashboardView
            },
            {
                path: 'agent',
                name: 'admin.agent',
                component: AdminAgentsIndexView
            },
            {
                path: 'agent/create',
                name: 'admin.agent.create',
                component: AdminAgentCreateView
            },
            {
                path: 'order',
                name: 'admin.order',
                component: AdminOrdersIndexView
            },
            {
                path: 'order/:id',
                name: 'admin.order.show',
                component: AdminOrderShowView
            },
            {
                path: 'order/:id/chat',
                name: 'admin.order.chat',
                component: AdminOrderChatView
            },
            {
                path: 'profile',
                name: 'admin.profile.index',
                component: AdminProfileIndexView
            },
            {
                path: 'profile/edit',
                name: 'admin.profile.edit',
                component: AdminProfileEditView
            },
            {
                path: 'profile/password',
                name: 'admin.profile.password',
                component: AdminProfilePasswordView
            },
            {
                path: 'services',
                name: 'admin.services',
                component: AdminServicesIndexView
            },
            {
                path: 'services/create',
                name: 'admin.services.create',
                component: AdminServiceCreateView
            },
            {
                path: 'services/:id/edit',
                name: 'admin.services.edit',
                component: AdminServiceEditView
            },
            {
                path: 'transactions',
                name: 'admin.transactions',
                component: AdminTransactionsIndexView
            },
            {
                path: 'transactions/:id',
                name: 'admin.transactions.show',
                component: AdminTransactionShowView
            },
            {
                path: 'user',
                name: 'admin.user',
                component: AdminUsersIndexView
            },
            {
                path: 'user/:id/edit',
                name: 'admin.user.edit',
                component: AdminUserEditView
            }
        ]
    },
    {
        path: '/agent',
        component: AgentLayout,
        meta: { requiresAuth: true, role: 'agent' },
        children: [
            {
                path: '',
                name: 'agent.dashboard',
                component: AgentDashboardView
            },
            {
                path: 'edit',
                name: 'agent.dashboard.edit',
                component: AgentEditInfoView
            },
            {
                path: 'update',
                name: 'agent.dashboard.update',
                component: AgentEditPasswordView
            },
            {
                path: 'order',
                name: 'agent.order',
                component: AgentOrdersIndexView
            },
            {
                path: 'order/:id',
                name: 'agent.order.show',
                component: AgentOrderShowView
            },
            {
                path: 'order/:id/chat',
                name: 'agent.order.chat',
                component: AgentOrderChatView
            }
        ]
    },
    {
        path: '/',
        component: AuthLayout,
        meta: { requiresGuest: true },
        children: [
            {
                path: 'login',
                name: 'login',
                component: LoginView
            },
            {
                path: 'register',
                name: 'register',
                component: RegisterView
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        // If back/forward button, maintain position
        if (savedPosition) {
            return savedPosition;
        }
        // Otherwise, always scroll to top
        return { top: 0 };
    }
});

router.beforeEach((to, from, next) => {
    const user = authStore.user;
    const token = localStorage.getItem('auth_token');

    // Check if the route requires authentication
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    // Check if the route requires guest access only (login/register)
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
    // Check if the route requires a specific role
    const requiredRole = to.matched.find(record => record.meta.role)?.meta.role;

    if (requiresAuth && !token) {
        // Redirect to login if not authenticated
        return next({ name: 'login' });
    }

    if (requiresAuth && requiredRole && user?.role !== requiredRole) {
        // Redirect to Unauthorized 401 page if role doesn't match
        return next({ name: 'unauthorized', replace: true });
    }

    if (requiresGuest && token) {
        // Redirect logged-in users away from guest-only pages based on their role
        if (user?.role === 'admin') return next({ name: 'admin.dashboard' });
        if (user?.role === 'agent') return next({ name: 'agent.dashboard' });
        return next({ name: 'home' });
    }

    // Proceed to the route
    next();
});

export default router;
