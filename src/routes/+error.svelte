<script lang="ts">
    import { page } from '$app/stores';
</script>

<svelte:head>
    <title>404 | Svelte App</title>
</svelte:head>

<h1 class="text-6xl font-bold">{$page.error?.message}</h1>
<a href="/" data-sveltekit-reload>Return Home?</a>

<style>
</style>
