<script lang="ts">
    import Navigation from '$lib/Navigation.svelte';
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    $: if (!pb.authStore.isValid && browser) {
        goto('/login');
    }
</script>

<div
    class="flex h-screen max-h-screen w-full flex-col-reverse items-center justify-start overflow-hidden bg-stone-100 lg:flex-row"
>
    <Navigation />

    <div class="flex h-full max-h-full w-full flex-1 shrink-0 flex-col overflow-auto p-3 lg:w-auto">
        <slot />
    </div>

    <div
        class="flex w-full flex-row items-center justify-center rounded-b-xl border-b-2 border-r-gray-200 bg-white p-3 shadow-lg lg:hidden"
    >
        <img src="/favicon.png" alt="Voix Logo" class="mr-3 mt-1 h-8 w-8" />
        <h1 class="font-jura text-4xl font-bold text-brand">Voix</h1>
    </div>
</div>

<style>
</style>
