<script lang="ts">
    import { goto } from '$app/navigation';
    import { pb } from '$lib/pocketbase';
    import type { UnsubscribeFunc } from 'pocketbase';
    import { onDestroy, onMount } from 'svelte';

    import type { PageData } from './$types';
    export let data: PageData;
    let unsubscribe: UnsubscribeFunc;

    onMount(async () => {
        unsubscribe = await pb.collection('rooms').subscribe('*', async () => {
            data = await fetch('/app/rooms').then((res) => res.json());
        });
    });

    onDestroy(() => {
        unsubscribe?.();
    });
</script>

<svelte:head>
    <title>Rooms | Voix</title>
</svelte:head>

<div class="mb-3 w-full rounded-lg bg-white p-5">
    <h1 class="text-xl font-bold">My Rooms</h1>
</div>

<div class="grid grid-cols-2 gap-5 rounded-lg bg-white p-5 shadow lg:grid-cols-6">
    <button
        class="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-lg border-2 border-zinc-100 bg-zinc-100 p-2 shadow hover:border-zinc-200 hover:bg-brand/20"
        on:click={async () => {
            const created = await fetch('/app/rooms', {
                method: 'POST',
            }).then((res) => res.json());
            goto('/app/rooms/' + created.id);
        }}
    >
        <img src="/assets/icons/plus.svg" alt="Plus Icon" class="h-12 w-12" />
        <p>Create new Room</p>
    </button>

    {#each data.rooms as room}
        <a
            class="flex aspect-[3/4] max-h-full flex-col items-center justify-start gap-1 overflow-hidden rounded-lg border-2 border-zinc-100 bg-zinc-100 p-2 shadow hover:border-zinc-200"
            href="/app/rooms/{room.id}"
        >
            <p class="mb-1 w-full text-left font-bold">{room.title}</p>
        </a>
    {/each}
</div>

<style>
</style>
