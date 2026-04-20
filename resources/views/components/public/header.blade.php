@php
    $navLinks = [
        ['label' => 'Home', 'url' => route('public.index')]
    ];

    if (Auth::check()) {
        $navLinks[] = ['label' => 'Profile', 'url' => route('user.dashboard')];
        $navLinks[] = ['label' => 'Track Order', 'url' => route('user.order')];
    } else {
        $navLinks[] = ['label' => 'Sign In', 'url' => route('login')];
        $navLinks[] = ['label' => 'Sign Up', 'url' => route('register'), 'class' => 'btn-primary'];
    }
@endphp

<x-header :nav-links="$navLinks" />
