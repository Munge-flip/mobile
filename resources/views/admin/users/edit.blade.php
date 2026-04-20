<x-layouts.admin>
    <section class="content">
        <div class="section-header">
            <h1>Edit User</h1>
            <a href="{{ route('admin.user') }}" class="action-link">
                ← Back to User List
            </a>
        </div>

        <admin-card title="User Information: {{ $user->name }}" :use-body="false">
            <form action="{{ route('admin.user.update', $user->id) }}" method="POST" class="modal-form">
                @csrf
                @method('PUT')
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value="{{ old('name', $user->name) }}" required>
                    @error('name') <span class="text-error">{{ $message }}</span> @enderror
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="{{ old('email', $user->email) }}" required>
                    @error('email') <span class="text-error">{{ $message }}</span> @enderror
                </div>
                <div class="form-group">
                    <label>Phone</label>
                    <input type="text" name="phone" value="{{ old('phone', $user->phone) }}">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select name="role">
                        <option value="user" {{ $user->role == 'user' ? 'selected' : '' }}>User</option>
                        <option value="agent" {{ $user->role == 'agent' ? 'selected' : '' }}>Agent</option>
                        <option value="admin" {{ $user->role == 'admin' ? 'selected' : '' }}>Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Password (Leave blank to keep current)</label>
                    <input type="password" name="password" placeholder="••••••••">
                    @error('password') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="modal-actions">
                    <a href="{{ route('admin.user') }}" class="btn-secondary">Cancel</a>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </admin-card>
    </section>
</x-layouts.admin>