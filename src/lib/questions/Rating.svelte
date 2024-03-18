<script lang="ts">
    import Star from '$lib/Star.svelte';
    import type { Question } from '$lib/pocketbase';

    export let i: number,
        question: Question,
        answer = '';

    let group: number;
    $: answer = (group + 1).toString();
</script>

<div class="w-full">
    <p class="w-full pl-1 font-bold">
        {i + 1} - {question.label}
        {#if question.required}<span class="text-red-600">*</span>{/if}
    </p>

    <div class="mt-1 flex flex-row items-center justify-start">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each Array(parseInt(question.options?.max) ?? 0) as _i, i}
            <label class="aspect-square">
                <Star filled={group >= i} />

                <input type="radio" bind:group value={i} class="hidden" />
            </label>
        {/each}
    </div>
</div>

<style>
</style>
