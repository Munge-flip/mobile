<x-layouts.admin>
    <section class="content">
        <div id="agents-section" class="content-section">
            <div class="section-header">
                <h1>Agents Management</h1>
                <a href="{{ route('admin.agent.create') }}" class="btn-primary">
                    + Add Agent
                </a>
            </div>

            <div class="agents-grid">
                @forelse ($agents as $agent)
                    <agent-card 
                        :agent="{{ json_encode(['id' => $agent->id, 'name' => $agent->name, 'tasks_count' => $agent->tasks_count]) }}"
                        orders-route="{{ route('admin.order', ['agent_id' => $agent->id]) }}"
                        manage-route="{{ route('admin.user.edit', $agent->id) }}"
                    ></agent-card>
                @empty
                    <p>No agents found.</p>
                @endforelse
            </div>
        </div>
    </section>
</x-layouts.admin>