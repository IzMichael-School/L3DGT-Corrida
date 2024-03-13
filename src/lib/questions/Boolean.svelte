<script lang="ts">
    import BooleanInput from '$lib/BooleanInput.svelte';
    import type { Question } from '$lib/pocketbase';

    export let i: number,
        question: Question,
        answer = 'false';

    let value = false;
    $: answer = question.options?.[value.toString()];
</script>

<div class="w-full">
    <p class="w-full pl-1 font-bold">
        {i + 1} - {question.label}
        {#if question.required}<span class="text-red-600">*</span>{/if}
    </p>
    <BooleanInput bind:value variant="slider" class="rounded-lg" classInner="rounded">
        <span slot="false">{question.options?.['false'] ?? ''}</span>
        <span slot="true">{question.options?.['true'] ?? ''}</span>
    </BooleanInput>
</div>

<style>
</style>
