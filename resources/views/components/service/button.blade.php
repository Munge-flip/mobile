@props(['category', 'service', 'price', 'label'])

<button 
    type="button" 
    class="service-btn" 
    data-category="{{ $category }}"
    data-service="{{ $service }}"
    data-price="{{ $price }}"
>
    <span>{{ $label }}</span>
    <span class="price">₱{{ number_format($price) }}</span>
</button>