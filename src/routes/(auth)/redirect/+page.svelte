<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;

    if (data.user?.id) {
        window.location.href = '/app';
    } else {
        window.location.href = '/';
    }
</script>

<svelte:head>
    <title>Redirect | Voix</title>
</svelte:head>

<style>
</style>
