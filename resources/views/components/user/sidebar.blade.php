<aside class="sidebar">
    <div class="sidebar-menu">
        <a href=" {{ route('user.dashboard') }} " @class(['menu-btn', 'active'=>request()->routeIs('user.dashboard*')])>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            My Account
        </a>
        <a href=" {{ route('user.order')}} " @class(['menu-btn', 'active'=> request()->routeIs('user.order*')])>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
            </svg>
            Order History
        </a>
        <a href="{{ route('user.transactions') }}" @class(['menu-btn', 'active'=> request()->routeIs('user.transactions*')])>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                <line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Transactions
        </a>
    </div>
</aside>