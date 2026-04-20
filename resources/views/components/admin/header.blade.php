<x-header>
    <div class="admin-info">
        <a href="{{ route('admin.profile.index') }}" style="color: white; text-decoration: none; transition: all 0.3s ease;">
            <span>Admin Panel</span>
        </a>
    </div>
    <li>
        <form method="POST" action="{{ route('logout') }}" style="display: inline;">
            @csrf
            <button type="submit" style="background: none; border: none; color: red; font-family: 'Syne', sans-serif; font-size: 22px; cursor: pointer; padding: 8px 16px;">
                Logout
            </button>
        </form>
    </li>
</x-header>