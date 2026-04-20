<x-layouts.admin>
    <section class="content">
        <div class="content-section">
            <h1>My Profile</h1>

            <profile-card 
                name="{{ auth()->user()->name }}" 
                role="Administrator" 
                avatar="{{ auth()->user()->avatar ? asset(auth()->user()->avatar) : '' }}"
            ></profile-card>

            <info-card title="Personal Information" manage-route="{{ route('admin.profile.edit') }}">
                <div class="info-grid">
                    <div class="info-item">
                        <label>Name</label>
                        <p>{{ auth()->user()->name }}</p>
                    </div>
                    <div class="info-item">
                        <label>Email Address</label>
                        <p>{{ auth()->user()->email }}</p>
                    </div>
                    <div class="info-item">
                        <label>Mobile Number</label>
                        <p>{{ auth()->user()->phone ?? 'Not set' }}</p>
                    </div>
                    <div class="info-item">
                        <label>Role</label>
                        <p style="text-transform: capitalize;">{{ auth()->user()->role }}</p>
                    </div>
                </div>
            </info-card>

            <info-card title="Password and Security" manage-route="{{ route('admin.profile.password') }}">
                <div class="info-grid">
                    <div class="info-item">
                        <label>Password</label>
                        <p>••••••••</p>
                    </div>
                    <div class="info-item">
                        <label>Account Created</label>
                        <p>{{ auth()->user()->created_at->format('M d, Y') }}</p>
                    </div>
                </div>
            </info-card>
        </div>
    </section>
</x-layouts.admin>