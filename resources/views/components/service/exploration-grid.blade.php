@props(['regions'])

<div class="exploration-grid">
    @foreach($regions as $region)
        <div class="exploration-card" data-region="{{ $region['slug'] }}">
            <div class="exploration-image {{ $region['slug'] }}-bg"></div>
            <h4>{{ $region['name'] }}</h4>
        </div>
    @endforeach
</div>