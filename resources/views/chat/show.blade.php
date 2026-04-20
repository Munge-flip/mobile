@php
    $layout = auth()->user()->role === 'agent' ? 'layouts.agent' : 'layouts.app';

    $sidebarComponent = auth()->user()->role === 'agent' ? 'x-agent.sidebar' : 'x-user.sidebar';
@endphp

<x-dynamic-component :component="$layout">
    
    <x-slot:sidebar>
        @if(auth()->user()->role === 'agent')
            <x-agent.sidebar />
        @else
            <x-user.sidebar />
        @endif
    </x-slot:sidebar>

    <section class="content">
        <div id="chat-section" class="content-section full-height">
            
            <div class="section-header" style="margin-bottom: 15px;">
                <h1>Chat: Order #{{ $order->id }} - {{ $order->game }}</h1>
                
                @if(auth()->user()->role === 'agent')
                    <a href="{{ route('agent.order.show', $order->id) }}" class="btn-secondary">Back to Order</a>
                @else
                    <a href="{{ route('user.order.show', $order->id) }}" class="btn-secondary">Back to Order</a>
                @endif
            </div>

            <div class="chat-container">
                <chat-box 
                    order-id="{{ $order->id }}" 
                    :current-user-id="{{ auth()->id() }}"
                    api-url="/{{ auth()->user()->role }}/api/orders/{{ $order->id }}"
                ></chat-box>
            </div>
        </div>
    </section>

    <script>
        const messageContainer = document.getElementById('chatMessages');
        if(messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    </script>

</x-dynamic-component>