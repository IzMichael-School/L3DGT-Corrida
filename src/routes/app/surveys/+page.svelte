<script lang="ts">
    import { goto } from '$app/navigation';
    import { pb } from '$lib/pocketbase';
    import type { UnsubscribeFunc } from 'pocketbase';
    import { onDestroy, onMount } from 'svelte';

    // Get data from server load function
    import type { PageData } from './$types';
    export let data: PageData;

    // Handle auto-fetch of new surveys
    let unsubscribe: UnsubscribeFunc;

    onMount(async () => {
        unsubscribe = await pb.collection('surveys').subscribe('*', async () => {
            data = await fetch('/app/surveys').then((res) => res.json());
        });
    });

    onDestroy(() => {
        unsubscribe?.();
    });
</script>

<svelte:head>
    <title>Surveys | Voix</title>
</svelte:head>

<div class="mb-3 w-full rounded-lg bg-white p-5">
    <h1 class="text-xl font-bold">My Surveys</h1>
</div>

<div class="grid grid-cols-2 gap-5 rounded-lg bg-white p-5 shadow lg:grid-cols-6">
    <!-- Create survey -->
    <button
        class="flex aspect-[3/4] flex-col items-center justify-center gap-2 rounded-lg border-2 border-zinc-100 bg-zinc-100 p-2 shadow hover:border-zinc-200 hover:bg-brand/20"
        on:click={async () => {
            // send API request
            const created = await fetch('/app/surveys', {
                method: 'POST',
            }).then((res) => res.json());
            goto('/app/surveys/edit/' + created.id);
        }}
    >
        <img src="/assets/icons/plus.svg" alt="Plus Icon" class="h-12 w-12" />
        <p>Create new Survey</p>
    </button>

    <!-- List of surveys -->
    {#each data.surveys as survey}
        <a
            class="flex aspect-[3/4] max-h-full flex-col items-center justify-start gap-1 overflow-hidden rounded-lg border-2 border-zinc-100 bg-zinc-100 p-2 shadow hover:border-zinc-200"
            href="/app/surveys/edit/{survey.id}"
        >
            <p class="mb-1 w-full text-left font-bold">{survey.title}</p>
            <!-- List of questions within survey -->
            {#each survey.questions as question, i}
                <p class="w-full text-left">{i + 1} - {question.label}</p>
            {/each}
        </a>
    {/each}
</div>

<style>
</style>
