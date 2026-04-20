@props(['items', 'type' => 'world']) 

{{-- Type can be 'world' or 'mode' --}}
<div class="{{ $type }}-selection">
    @foreach($items as $item)
        <div class="{{ $type }}-card" data-{{ $type }}="{{ $item['slug'] }}">
            <div class="{{ $type }}-label">{{ $item['name'] }}</div>
        </div>
    @endforeach
</div>