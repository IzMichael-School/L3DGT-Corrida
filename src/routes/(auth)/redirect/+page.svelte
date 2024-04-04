<script lang="ts">
    import Button from '$lib/Button.svelte';

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

<Button
    on:click={() => {
        if (data.user?.id) {
            window.location.href = '/app';
        } else {
            window.location.href = '/';
        }
    }}
>
    Not Working? Try this...
</Button>

<style>
</style>
