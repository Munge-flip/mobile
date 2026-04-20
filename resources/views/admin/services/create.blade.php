<x-layouts.admin>
    <section class="content">
        <div class="section-header">
            <h1>Add New Service</h1>
            <a href="{{ route('admin.services.index') }}" class="action-link">
                ← Back to Services
            </a>
        </div>

        <admin-card title="Service Information" :use-body="false">
            <form action="{{ route('admin.services.store') }}" method="POST" class="modal-form">
                @csrf

                <div class="form-group">
                    <label>Game <span style="color: red;">*</span></label>
                    <select name="game" required class="search-input" style="width: 100%;">
                        <option value="">Select Game</option>
                        <option value="Genshin Impact">Genshin Impact</option>
                        <option value="Honkai Star Rail">Honkai Star Rail</option>
                        <option value="Zenless Zone Zero">Zenless Zone Zero</option>
                    </select>
                    @error('game') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Category <span style="color: red;">*</span></label>
                    <select name="category" required class="search-input" style="width: 100%;">
                        <option value="">Select Category</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Quests">Quests</option>
                        <option value="Events">Events</option>
                        <option value="Endgame">Endgame</option>
                        <option value="Exploration">Exploration</option>
                        <option value="Special">Special</option>
                    </select>
                    @error('category') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Service Name <span style="color: red;">*</span></label>
                    <input type="text" name="name" value="{{ old('name') }}" required 
                           placeholder="e.g., Daily Commissions">
                    @error('name') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="3" class="search-input" 
                              style="width: 100%; resize: vertical;"
                              placeholder="Brief description of the service...">{{ old('description') }}</textarea>
                    @error('description') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Price (₱) <span style="color: red;">*</span></label>
                    <input type="number" name="price" value="{{ old('price') }}" required 
                           min="0" step="0.01" placeholder="0.00">
                    @error('price') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" name="is_active" value="1" checked>
                        <span>Active (Service available to users)</span>
                    </label>
                </div>

                <div class="modal-actions">
                    <a href="{{ route('admin.services.index') }}" class="btn-secondary">Cancel</a>
                    <button type="submit" class="btn-primary">Create Service</button>
                </div>
            </form>
        </admin-card>
    </section>
</x-layouts.admin>