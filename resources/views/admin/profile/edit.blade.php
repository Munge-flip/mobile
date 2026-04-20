<x-layouts.admin>
    <section class="content">
        <div class="section-header">
            <h1>Edit Personal Information</h1>
            <a href="{{ route('admin.profile.index') }}" class="action-link">
                ← Back to Profile
            </a>
        </div>

        <admin-card>
            <form action="{{ route('admin.profile.update') }}" method="POST" class="modal-form">
                @csrf
                @method('PATCH')

                <div class="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value="{{ old('name', auth()->user()->name) }}" required>
                    @error('name') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value="{{ old('email', auth()->user()->email) }}" required>
                    @error('email') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" name="phone" value="{{ old('phone', auth()->user()->phone) }}">
                    @error('phone') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="modal-actions">
                    <a href="{{ route('admin.profile.index') }}" class="btn-secondary">Cancel</a>
                    <button type="submit" class="btn-primary">Save Changes</button>
                </div>
            </form>
        </admin-card>
    </section>
</x-layouts.admin>