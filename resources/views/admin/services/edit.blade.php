<x-layouts.admin>
    <section class="content">
        <div class="section-header">
            <h1>Edit Service</h1>
            <a href="{{ route('admin.services.index') }}" class="action-link">
                ← Back to Services
            </a>
        </div>

        <admin-card title="Service Information: {{ $service->name }}" :use-body="false">
            <form action="{{ route('admin.services.update', $service->id) }}" method="POST" class="modal-form">
                @csrf
                @method('PUT')

                <div class="form-group">
                    <label>Game <span style="color: red;">*</span></label>
                    <select name="game" required class="search-input" style="width: 100%;">
                        <option value="">Select Game</option>
                        <option value="Genshin Impact" {{ $service->game == 'Genshin Impact' ? 'selected' : '' }}>Genshin Impact</option>
                        <option value="Honkai Star Rail" {{ $service->game == 'Honkai Star Rail' ? 'selected' : '' }}>Honkai Star Rail</option>
                        <option value="Zenless Zone Zero" {{ $service->game == 'Zenless Zone Zero' ? 'selected' : '' }}>Zenless Zone Zero</option>
                    </select>
                    @error('game') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Category <span style="color: red;">*</span></label>
                    <select name="category" required class="search-input" style="width: 100%;">
                        <option value="">Select Category</option>
                        <option value="Maintenance" {{ $service->category == 'Maintenance' ? 'selected' : '' }}>Maintenance</option>
                        <option value="Quests" {{ $service->category == 'Quests' ? 'selected' : '' }}>Quests</option>
                        <option value="Events" {{ $service->category == 'Events' ? 'selected' : '' }}>Events</option>
                        <option value="Endgame" {{ $service->category == 'Endgame' ? 'selected' : '' }}>Endgame</option>
                        <option value="Exploration" {{ $service->category == 'Exploration' ? 'selected' : '' }}>Exploration</option>
                        <option value="Special" {{ $service->category == 'Special' ? 'selected' : '' }}>Special</option>
                    </select>
                    @error('category') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Service Name <span style="color: red;">*</span></label>
                    <input type="text" name="name" value="{{ old('name', $service->name) }}" required 
                           placeholder="e.g., Daily Commissions">
                    @error('name') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="3" class="search-input" 
                              style="width: 100%; resize: vertical;"
                              placeholder="Brief description of the service...">{{ old('description', $service->description) }}</textarea>
                    @error('description') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label>Price (₱) <span style="color: red;">*</span></label>
                    <input type="number" name="price" value="{{ old('price', $service->price) }}" required 
                           min="0" step="0.01" placeholder="0.00">
                    @error('price') <span class="text-error">{{ $message }}</span> @enderror
                </div>

                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                        <input type="checkbox" name="is_active" value="1" {{ $service->is_active ? 'checked' : '' }}>
                        <span>Active (Service available to users)</span>
                    </label>
                </div>

                <div class="modal-actions">
                    <a href="{{ route('admin.services.index') }}" class="btn-secondary">Cancel</a>
                    <button type="submit" class="btn-primary">Update Service</button>
                </div>
            </form>
        </admin-card>
    </section>
</x-layouts.admin>