<script lang="ts">
    import TextInput from '$lib/TextInput.svelte';
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
    <TextInput bind:value={answer} variant="default" placeholder="Type your short answer here..." class="w-full" />
</div>

<style>
</style>
