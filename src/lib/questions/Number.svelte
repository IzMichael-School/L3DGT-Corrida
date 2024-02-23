<script lang="ts">
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import type { Question } from '$lib/pocketbase';

    export let i: number,
        question: Question,
        answer = '0';

    let value = 0,
        txtValue = '0';
    $: txtValue = value.toString();
    $: answer = value.toString();

    $: if (value > parseInt(question.options.max)) value = parseInt(question.options.max);
    $: if (value < parseInt(question.options.min)) value = parseInt(question.options.min);
</script>

<div class="w-full">
    <p class="w-full pl-1 font-bold">
        {i + 1} - {question.label}
        {#if question.required}<span class="text-red-600">*</span>{/if}
    </p>
    <div class="my-1 flex flex-row items-center justify-start gap-2">
        <Button variant="secondary" class="w-fit" on:click={() => value--}>
            <img src="/assets/icons/minus.svg" alt="Minus Icon" class="h-5 w-5" />
        </Button>

        <TextInput
            variant="filled"
            class="my-0 w-24 min-w-24 text-center"
            type="number"
            placeholder="000"
            bind:value={txtValue}
            on:keyup={() => (value = parseInt(txtValue))}
        />

        <!-- <input
            type="number"
            class="my-0 w-24 min-w-24 rounded-lg bg-gray-100 p-2 text-center font-normal text-black outline-none transition-colors duration-200 ease-in-out hover:bg-gray-200"
            placeholder="0"
            bind:txtValue
            on:change={() => (value = parseInt(txtValue))}
        /> -->

        <Button variant="secondary" class="w-fit" on:click={() => value++}>
            <img src="/assets/icons/plus.svg" alt="Plus Icon" class="h-5 w-5" />
        </Button>
    </div>
</div>

<style>
</style>
