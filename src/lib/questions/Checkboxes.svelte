<script lang="ts">
    import TickInput from '$lib/TickInput.svelte';
    import type { Question } from '$lib/pocketbase';

    export let i: number,
        question: Question,
        answer = '';

    let val: string[] = [];
    $: answer = val.join(', ');
</script>

<div class="w-full">
    <p class="w-full pl-1 font-bold">
        {i + 1} - {question.label}
        {#if question.required}<span class="text-red-600">*</span>{/if}
    </p>
    {#each Object.entries(question.options) as option}
        <TickInput
            on:change={(e) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (e.target?.checked) {
                    val = [...val, option[1]];
                } else {
                    val.splice(val.indexOf(option[1]), 1);
                }
            }}
            value={option[1]}
            variant="checkbox"
        >
            {option[1]}
        </TickInput>
    {/each}
</div>

<style>
</style>
