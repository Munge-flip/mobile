@props(['gameIcon', 'gameName', 'instructionTitle' => 'How to order', 'customInstructions' => null])

<div class="game-info">
    <img src="{{ $gameIcon }}" alt="{{ $gameName }}" class="game-icon">
    <h2>{{ $gameName }}</h2>
</div>

<div class="how-to-order">
    <h3>{{ $instructionTitle }}</h3>
    <ol>
        @if($customInstructions)
            @foreach($customInstructions as $instruction)
                <li>{{ $instruction }}</li>
            @endforeach
        @else
            <li>Select the service you want.</li>
            <li>Complete your payment.</li>
            <li>The service will be added to your service catalog.</li>
            <li>We will contact you when we are ready to do the service and ask a few questions before proceeding.</li>
        @endif
    </ol>
</div>