<x-layouts.admin>
    <section class="content">
        <div class="content-section">
            <div class="section-header">
                <h1>Service Management</h1>
                <a href="{{ route('admin.services.create') }}" class="btn-primary">
                    + Add New Service
                </a>
            </div>

            {{-- Filters --}}
            <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <form action="{{ route('admin.services.index') }}" method="GET" style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" name="search" placeholder="Search by name..." 
                           value="{{ request('search') }}" class="search-input" style="flex: 1;">
                    
                    <select name="game" class="search-input" style="width: 200px;">
                        <option value="">All Games</option>
                        <option value="Genshin Impact" {{ request('game') == 'Genshin Impact' ? 'selected' : '' }}>Genshin Impact</option>
                        <option value="Honkai Star Rail" {{ request('game') == 'Honkai Star Rail' ? 'selected' : '' }}>Honkai Star Rail</option>
                        <option value="Zenless Zone Zero" {{ request('game') == 'Zenless Zone Zero' ? 'selected' : '' }}>Zenless Zone Zero</option>
                    </select>

                    <select name="category" class="search-input" style="width: 200px;">
                        <option value="">All Categories</option>
                        <option value="Maintenance" {{ request('category') == 'Maintenance' ? 'selected' : '' }}>Maintenance</option>
                        <option value="Quests" {{ request('category') == 'Quests' ? 'selected' : '' }}>Quests</option>
                        <option value="Events" {{ request('category') == 'Events' ? 'selected' : '' }}>Events</option>
                        <option value="Endgame" {{ request('category') == 'Endgame' ? 'selected' : '' }}>Endgame</option>
                        <option value="Exploration" {{ request('category') == 'Exploration' ? 'selected' : '' }}>Exploration</option>
                    </select>

                    <button type="submit" class="btn-primary">Filter</button>
                    <a href="{{ route('admin.services.index') }}" class="btn-secondary">Clear</a>
                </form>
            </div>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Game</th>
                            <th>Category</th>
                            <th>Service Name</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($services as $service)
                        <tr>
                            <td>#{{ $service->id }}</td>
                            <td>{{ $service->game }}</td>
                            <td>{{ $service->category }}</td>
                            <td>{{ $service->name }}</td>
                            <td>₱{{ number_format($service->price, 2) }}</td>
                            <td>
                                <status-badge status="{{ $service->is_active ? 'completed' : 'pending' }}"></status-badge>
                            </td>
                            <td>{{ $service->created_at->format('M d, Y') }}</td>
                            <td>
                                <a href="{{ route('admin.services.edit', $service->id) }}" class="action-link">Edit</a>
                                
                                <form action="{{ route('admin.services.toggle', $service->id) }}" method="POST" style="display: inline;">
                                    @csrf
                                    @method('PATCH')
                                    <button type="submit" class="action-link" style="background: none; border: none; cursor: pointer; color: {{ $service->is_active ? '#e74c3c' : '#27ae60' }};">
                                        {{ $service->is_active ? 'Deactivate' : 'Activate' }}
                                    </button>
                                </form>

                                <form action="{{ route('admin.services.destroy', $service->id) }}" method="POST" class="delete-form">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="action-link delete" onclick="return confirm('Are you sure?')">Delete</button>
                                </form>
                            </td>
                        </tr>
                        @empty
                        <tr class="empty-state-row">
                            <td colspan="8">No services found.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>

            <div class="pagination-wrapper">
                {{ $services->links() }}
            </div>
        </div>
    </section>
</x-layouts.admin>