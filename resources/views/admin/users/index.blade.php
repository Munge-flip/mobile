<x-layouts.admin>
    <section class="content">
        <div id="users-section" class="content-section">
            <div class="section-header">
                <h1>Users Management</h1>
                <form action="{{ route('admin.user') }}" method="GET">
                    <input type="text" name="search" placeholder="Search users..." class="search-input" value="{{ request('search') }}">
                </form>
            </div>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th> 
                            <th>Email</th>
                            <th>Role</th>     
                            <th>Date Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($users as $user)
                            <tr>
                                <td>#{{ $user->id }}</td>
                                <td>{{ $user->name }}</td>
                                <td>{{ $user->email }}</td>
                                
                                <td>
                                    <status-badge status="{{ $user->role }}" type="role"></status-badge>
                                </td>

                                <td>{{ $user->created_at->format('m/d/Y') }}</td>
                                
                                <td>
                                    <a href="{{ route('admin.user.edit', $user->id) }}" class="action-link">Edit</a>
                                    
                                    <form action="{{ route('admin.user.delete', $user->id) }}" method="POST" class="delete-form">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="action-link delete" onclick="return confirm('Are you sure?')">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr class="empty-state-row">
                                <td colspan="6">No users found.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            <div class="pagination-wrapper">
                {{ $users->links() }}
            </div>
            
        </div>
    </section>
</x-layouts.admin>