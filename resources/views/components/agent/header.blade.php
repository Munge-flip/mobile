<x-header>
    <div class="admin-info">
        <span>Agent Panel</span>
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
