<script lang="ts">
    import TickInput from '$lib/TickInput.svelte';
    import type { Question } from '$lib/pocketbase';

    export let i: number,
        question: Question,
        answer = '';
</script>

<div class="w-full">
    <p class="w-full pl-1 font-bold">
        {i + 1} - {question.label}
        {#if question.required}<span class="text-red-600">*</span>{/if}
    </p>
    {#each Object.entries(question.options) as option}
        <TickInput bind:group={answer} value={option[1]} variant="radio">
            {option[1]}
        </TickInput>
    {/each}
</div>

<style>
</style>
