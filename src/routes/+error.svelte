<script lang="ts">
    import { page } from '$app/stores';
    import Button from '$lib/Button.svelte';
    import Copyright from '$lib/Copyright.svelte';
</script>

<svelte:head>
    <title>{$page.status} | Voix</title>
</svelte:head>

<div class="flex h-screen w-screen lg:flex-row flex-col items-center justify-between overflow-hidden">
    <section class="relative flex h-1/2 lg:flex-1 w-full items-center justify-center lg:h-full lg:w-auto">
        <img src="/assets/img/iceberg-unsplash.jpg" alt="Iceberg in the Water" class="h-full w-full object-cover" />
        <div class="absolute inset-0 z-10 flex h-full w-full items-end justify-end bg-purple-400/20 p-2 text-sm" />
    </section>

    <section class="flex h-1/2 lg:flex-1 w-full flex-col items-center justify-center shadow-lg lg:h-full lg:w-auto">
        <div class="flex w-2/3 flex-1 flex-col items-center justify-center">
            <h1 class="text-center text-4xl font-bold">Error {$page.status}</h1>
            <h2 class="mb-5 mt-3 text-center text-3xl font-bold">{$page.error?.message}</h2>
            <a href="/" class="contents" data-sveltekit-reload>
                <Button variant="primary">Return Home?</Button>
            </a>
        </div>

        <Copyright />
    </section>
</div>

<style>
</style>
