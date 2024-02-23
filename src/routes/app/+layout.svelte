<script lang="ts">
    import Sidebar from '$lib/Sidebar.svelte';
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    $: if (!pb.authStore.isValid && browser) {
        goto('/login');
    }
</script>

<div class="flex h-screen max-h-screen w-full flex-row items-center justify-start overflow-hidden bg-stone-100">
    <Sidebar />
    <div class="flex h-full max-h-full flex-1 flex-col overflow-auto p-3">
        <slot />
    </div>
</div>

<style>
</style>
