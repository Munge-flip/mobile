<x-header>
    <ul>
        <li><a href="{{ route('public.index') }}">Home</a></li>
        @auth
        <li><a href="{{ route('user.dashboard') }}">Profile</a></li>
        <li><a href="{{ route('user.order') }}">Track Order</a></li>
        <li>
            <form method="POST" action="{{ route('logout') }}" style="display: inline;">
                @csrf
                <button type="submit" style="background: none; border: none; color: red; font-family: 'Syne', sans-serif; font-size: 22px; cursor: pointer; padding: 8px 16px;">
                    Logout
                </button>
            </form>
        </li>
        @else
        <li><a href="{{ route('login') }}">Sign In</a></li>
        <li><a href="{{ route('register') }}" class="btn-primary" style="text-decoration: none; font-size: 16px; padding: 8px 20px;">Sign Up</a></li>
        @endauth
    </ul>
</x-header>
