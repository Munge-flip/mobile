<x-layouts.admin>
    <section class="content">
        <div class="section-header">
            <h1>Change Password</h1>
            <a href="{{ route('admin.profile.index') }}" class="action-link">
                ← Back to Profile
            </a>
        </div>

        <admin-card>
            <form action="{{ route('admin.profile.password.update') }}" method="POST" class="modal-form">
                @csrf
                @method('PUT')

                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" name="current_password" required>
                    @error('current_password') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" name="password" required minlength="8">
                    @error('password') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" name="password_confirmation" required>
                </div>

                <div class="modal-actions">
                    <a href="{{ route('admin.profile.index') }}" class="btn-secondary">Cancel</a>
                    <button type="submit" class="btn-primary">Update Password</button>
                </div>
            </form>
        </admin-card>
    </section>
</x-layouts.admin>