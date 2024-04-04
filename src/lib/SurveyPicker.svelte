<script lang="ts">
    import type { SurveysResponse } from '$lib/pocketbase-types';
    import type { Question } from '$lib/pocketbase';
    import Button from './Button.svelte';
    import Modal from './Modal.svelte';
    import TextInput from './TextInput.svelte';
    import dayjs from 'dayjs';

    export let value: string,
        surveys: SurveysResponse<Question[]>[] = [];
    let selected: SurveysResponse<Question[]>,
        modalShown = false,
        filter = '';

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

{#if modalShown}
    <Modal on:clickOut={() => (modalShown = false)}>
        <div
            class="flex h-full max-h-full w-full flex-col items-center justify-between overflow-auto lg:h-[60vh] lg:w-[48rem] lg:flex-row lg:overflow-hidden"
        >
            <div
                class="max-h-full w-full border-t border-gray-300 p-3 shadow-lg lg:h-full lg:w-1/2 lg:flex-none lg:overflow-auto lg:border-r"
            >
                <TextInput bind:value={filter} class="mb-2 w-full" placeholder="Search for a Survey..." />
                {#each surveys.filter((a) => a.title.toLowerCase().includes(filter.toLowerCase()) || (a.questions ?? [])
                            .map((b) => b.label)
                            .join(' ')
                            .toLowerCase()
                            .includes(filter.toLowerCase())) as survey}
                    <button
                        class="mt-1 w-full rounded-lg p-2 hover:bg-gray-100"
                        class:bg-gray-100={selected?.id == survey.id}
                        on:click={() => (selected = survey)}
                    >
                        <h2 class="w-full text-left text-lg font-semibold">{survey.title}</h2>
                        <p class="w-full text-left">
                            {survey.questions?.length} Questions - Updated {dayjs(survey.updated).format(
                                'ddd, DD MMM YYYY'
                            )}
                        </p>
                    </button>
                {/each}
            </div>
            <div
                class="flex max-h-full w-full flex-col items-center justify-start border-b border-gray-300 p-3 shadow-inner lg:h-full lg:w-1/2 lg:flex-none lg:overflow-auto lg:border-l"
            >
                {#if selected}
                    <h3 class="w-full text-left text-lg font-bold">{selected.title}</h3>
                    {#each selected.questions ?? [] as question, i}
                        <p class="mt-2 w-full text-left font-semibold">{i + 1} - {question.label}</p>
                        {#if question.options}
                            {#if question.type == 'number' || question.type == 'rating'}
                                <p class="w-full text-left">{question.options.min} - {question.options.max}</p>
                            {:else}
                                <p class="w-full text-left">{Object.values(question.options).join(', ')}</p>
                            {/if}
                        {/if}
                    {/each}
                    <span class="flex-1" />
                    <Button
                        on:click={() => {
                            (value = selected.id), (modalShown = false);
                            dispatch('select');
                        }}
                        class="mt-5"
                    >
                        Select
                    </Button>
                {:else}
                    <p>Select a Survey to Preview</p>
                {/if}
            </div>
        </div>
    </Modal>
{/if}

<Button on:click={() => (modalShown = true)} variant={value ? 'secondary' : 'primary'}>
    {value ? surveys.find((a) => a.id == value)?.title : 'No Survey Selected'}
</Button>

<style>
</style>
