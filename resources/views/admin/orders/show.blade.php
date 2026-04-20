<x-layouts.admin>
    <section class="content">
        <admin-order-details 
            :initial-order="{{ json_encode($order->load(['user', 'agent'])) }}"
            :agents="{{ json_encode($agents) }}"
            api-url="/admin/api/orders"
        ></admin-order-details>
    </section>
</x-layouts.admin>