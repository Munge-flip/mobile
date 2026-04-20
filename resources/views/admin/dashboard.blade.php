<x-layouts.admin>
    <section class="content">
        <admin-dashboard-overview 
            :initial-stats="{{ json_encode([
                'totalOrders' => $totalOrders,
                'activeAgents' => $activeAgents,
                'totalUsers' => $totalUsers,
                'revenue' => (float)$revenue,
                'pendingTransactions' => $pendingTransactions,
                'verifiedTransactions' => $verifiedTransactions,
                'totalTransactions' => $totalTransactions,
            ]) }}"
            :initial-orders="{{ json_encode($recentOrders->map(fn($o) => [
                'id' => $o->id,
                'game' => $o->game,
                'service_type' => $o->service_type,
                'user_name' => $o->user->name ?? 'Unknown',
                'created_at_human' => $o->created_at->diffForHumans(),
            ])) }}"
            :initial-transactions="{{ json_encode($recentTransactions->map(fn($t) => [
                'id' => $t->id,
                'amount' => $t->amount,
                'status' => $t->status,
                'user_name' => $t->user->name ?? 'Unknown',
                'order_id' => $t->order_id,
                'created_at_human' => $t->created_at->diffForHumans(),
            ])) }}"
            api-url="/admin/api/stats"
        ></admin-dashboard-overview>
    </section>
</x-layouts.admin>