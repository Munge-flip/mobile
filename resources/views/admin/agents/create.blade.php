<x-layouts.admin>
    <section class="content">
        <div class="section-header">
            <h1>Add New Agent</h1>
            <a href="{{ route('admin.agent') }}" class="action-link">← Back to Agents</a>
        </div>

        <admin-card title="Agent Information" :use-body="false">
            <form action="{{ route('admin.agent.store') }}" method="POST" class="modal-form">
                @csrf

                <div class="form-group">
                    <label>Agent Name</label>
                    <input type="text" name="name" value="{{ old('name') }}" required>
                    @error('name') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value="{{ old('email') }}" required>
                    @error('email') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="phone" value="{{ old('phone') }}" required>
                    @error('phone') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" name="password" required minlength="8">
                    @error('password') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="modal-actions">
                    <a href="{{ route('admin.agent') }}" class="btn-secondary">Cancel</a>
                    <button type="submit" class="btn-primary">Add Agent</button>
                </div>
            </form>
        </admin-card>
    </section>
</x-layouts.admin>