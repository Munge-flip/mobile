<app-header 
    logo-url="{{ asset('img/weblogo.png') }}" 
    home-url="{{ route('public.index') }}"
    :is-logged-in="{{ Auth::check() ? 'true' : 'false' }}"
    logout-url="{{ route('logout') }}"
    :nav-links="{{ json_encode($navLinks ?? []) }}"
>
    <!-- We use a named slot for the logout CSRF so Blade can inject it -->
    <template #csrf>
        @csrf
    </template>
</app-header>
