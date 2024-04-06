<script lang="ts">
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import { flip } from 'svelte/animate';
    import { nanoid } from 'nanoid';
    import { goto } from '$app/navigation';
    import type { Question } from '$lib/pocketbase';
    import BooleanInput from '$lib/BooleanInput.svelte';
    import * as Toast from '$lib/toasts/toast';
    import Confirm from '$lib/Confirm.svelte';

    // Get data from server load function
    import type { PageData } from './$types';
    export let data: PageData;

    // Swap two items in an array by index
    function swap(array: Question[], x: number, y: number) {
        var b = array[x];
        array[x] = array[y];
        array[y] = b;
        return array;
    }
</script>

<svelte:head>
    <title>Editing Survey | Voix</title>
</svelte:head>

<div
    class="flex w-full flex-col items-center justify-start gap-3 lg:h-full lg:max-h-full lg:flex-row lg:justify-center"
>
    <div class="flex w-full flex-col items-center justify-start rounded-lg bg-white p-5 shadow lg:h-full lg:w-1/3">
        <h1 class="text-2xl font-bold">Survey Editor</h1>

        <p class="mt-5 w-full text-left text-sm">Survey Title</p>
        <TextInput bind:value={data.title} class="mb-0 w-full" />

        <span class="min-h-5 flex-1" />

        <!-- Delete survey, requiring confirmation -->
        <Confirm
            action={async () => {
                let working = Toast.add('Deleting...', {
                    type: 'warning',
                    timeout: 60 * 60 * 1000,
                });
                goto('/app/surveys');
                await fetch('/app/surveys/edit/' + data.id, {
                    method: 'DELETE',
                });
                Toast.dismiss(working);
                Toast.add('Deleted Survey.', {
                    type: 'success',
                });
            }}
        >
            <Button variant="danger" class="mb-2">Delete Survey</Button>
        </Confirm>

        <!-- Save changes -->
        <Button
            variant="primary"
            on:click={async () => {
                let working = Toast.add('Saving...', {
                    type: 'info',
                    timeout: 60 * 60 * 1000,
                });
                await fetch('/app/surveys/edit/' + data.id, {
                    method: 'PUT',
                    body: JSON.stringify(data),
                });
                Toast.dismiss(working);
                Toast.add('Saved Changes.', {
                    type: 'success',
                });
            }}
        >
            Save Changes
        </Button>
    </div>

    <div
        class="flex w-full flex-col items-center justify-start gap-3 lg:h-full lg:max-h-full lg:w-auto lg:flex-1 lg:overflow-y-auto"
    >
        <div class="w-full rounded-lg bg-white p-5 shadow">
            <h2 class="text-xl font-bold">Questions ({data.questions?.length})</h2>
        </div>

        <!-- List of questions -->
        {#each data.questions ?? [] as question, i (question.id)}
            <div
                class="w-full rounded-lg bg-white p-5 shadow transition-all duration-300 ease-in-out"
                animate:flip={{ duration: 300 }}
            >
                <p class="font-bold">Question {i + 1}.</p>

                <div class="mt-3 flex w-full flex-col items-center justify-between gap-5 lg:flex-row">
                    <!-- Edit question itself -->
                    <div class="flex w-full flex-col items-center justify-start gap-1 lg:w-auto lg:flex-1">
                        <p class="w-full text-sm">Question Label</p>
                        <TextInput bind:value={question.label} class="my-0 w-full" placeholder="Ask any question..." />
                    </div>
                    <!-- Pick question type -->
                    <div class="flex w-full flex-col items-center justify-start gap-1 lg:w-auto lg:flex-1">
                        <p class="w-full text-sm">Question Type</p>
                        <select
                            bind:value={question.type}
                            class="my-0 w-full rounded-lg border border-gray-400 bg-white p-[calc(0.625rem+1px)] font-normal text-black outline-none hover:bg-gray-200"
                            on:change={() => {
                                if (question.type == 'boolean') {
                                    question.options.true = '';
                                    question.options.false = '';
                                }
                                if (question.type == 'number' || question.type == 'rating') {
                                    question.options.max = '100';
                                    question.options.min = question.type == 'rating' ? '1' : '0';
                                }
                            }}
                        >
                            <option value="short-text">Short Text</option>
                            <option value="long-text">Long Text</option>
                            <option value="number">Number</option>
                            <option value="boolean">True / False</option>
                            <option value="rating">Rating</option>
                            <option value="radio">Radio Buttons</option>
                            <option value="checkboxes">Checkboxes</option>
                        </select>
                    </div>
                </div>

                <div class="mt-3 grid w-full grid-cols-1 gap-3 lg:grid-cols-3">
                    <!-- If question is number or rating, use min and max options -->
                    {#if (question.type == 'number' || question.type == 'rating') && question.options?.max != undefined && question.options?.min != undefined}
                        <div class="flex w-full flex-col items-center justify-start gap-1">
                            <p class="w-full text-sm">Maximum Value</p>
                            <TextInput bind:value={question.options['max']} class="w-full min-w-4" type="number" />
                        </div>
                        {#if question.type != 'rating'}
                            <div class="flex w-full flex-col items-center justify-start gap-1">
                                <p class="w-full text-sm">Minimum Value</p>
                                <TextInput bind:value={question.options['min']} class="w-full min-w-4" type="number" />
                            </div>
                        {/if}
                    {/if}

                    <!-- If question is boolean, use true or false -->
                    {#if question.type == 'boolean' && question.options?.true != undefined && question.options?.false != undefined}
                        <div class="flex w-full flex-col items-center justify-start gap-1">
                            <p class="w-full text-sm">True Label</p>
                            <TextInput bind:value={question.options['true']} class="w-full min-w-4" />
                        </div>
                        <div class="flex w-full flex-col items-center justify-start gap-1">
                            <p class="w-full text-sm">False Label</p>
                            <TextInput bind:value={question.options['false']} class="w-full min-w-4" />
                        </div>
                    {/if}

                    <!-- If question is multiple choice, use free options -->
                    {#if (question.type == 'radio' || question.type == 'checkboxes') && question.options != undefined}
                        {#each Object.keys(question.options) as entry (entry)}
                            <div
                                class="flex w-full flex-col items-center justify-start gap-1"
                                animate:flip={{ duration: 300 }}
                            >
                                <p class="w-full text-sm">Option Label</p>
                                <div class="flex w-full flex-row items-center justify-between gap-1">
                                    <TextInput bind:value={question.options[entry]} class="mb-0 min-w-4 flex-1" />
                                    <Button
                                        variant="danger"
                                        class="aspect-square w-fit p-2"
                                        on:click={() => {
                                            delete question.options[entry];
                                            // eslint-disable-next-line no-self-assign
                                            question.options = question.options;
                                        }}
                                    >
                                        <img src="/assets/icons/trash.svg" alt="Rubbish Bin" class="h-6 w-6 invert" />
                                    </Button>
                                </div>
                            </div>
                        {/each}

                        <!-- Add new option -->
                        <div class="flex flex-col items-center justify-end">
                            <Button
                                variant="secondary"
                                class="h-fit min-w-4 text-base"
                                on:click={() => {
                                    question.options[nanoid()] = '';
                                }}
                            >
                                Add Option
                            </Button>
                        </div>
                    {/if}
                </div>

                <div class="mt-5 flex w-full flex-row items-center justify-end gap-3">
                    <!-- Is question required -->
                    <p class="w-fit">Required Question</p>
                    <BooleanInput
                        variant="switch"
                        class="rounded-full"
                        classInner="rounded-full"
                        bind:value={question.required}
                    />

                    <span class="block min-h-5 flex-1" />

                    <!-- Move question upwards -->
                    {#if i != 0}
                        <Button
                            class="w-fit"
                            variant="secondary"
                            on:click={() => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                data.questions = swap(data.questions, i, i - 1);
                            }}
                        >
                            <img src="/assets/icons/chevron-up.svg" alt="Arrow Pointing Upwards" class="h-7 w-7" />
                        </Button>
                    {/if}

                    <!-- Move question downwards -->
                    {#if i != (data.questions?.length ?? 0) - 1}
                        <Button
                            class="w-fit"
                            variant="secondary"
                            on:click={() => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                data.questions = swap(data.questions, i, i + 1);
                            }}
                        >
                            <img
                                src="/assets/icons/chevron-up.svg"
                                alt="Arrow Pointing Downwards"
                                class="h-7 w-7 rotate-180"
                            />
                        </Button>
                    {:else}
                        <Button class="invisible w-fit">
                            <span class="w-7" />
                        </Button>
                    {/if}

                    <!-- Delete question -->
                    <Button
                        class="w-fit"
                        variant="danger"
                        on:click={() => {
                            data.questions?.splice(i, 1);
                            // eslint-disable-next-line no-self-assign
                            data.questions = data.questions;
                        }}
                    >
                        <img src="/assets/icons/trash.svg" alt="Rubbish Bin" class="h-7 w-7 invert" />
                    </Button>
                </div>
            </div>
        {/each}

        <!-- Create new question -->
        <Button
            variant="primary"
            on:click={() => {
                let newQuestion = {
                    id: nanoid(),
                    label: '',
                    type: 'short-text',
                    required: false,
                    options: {},
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                data.questions = [...data.questions, newQuestion];
            }}
        >
            Add Question
        </Button>
    </div>
</div>

<style>
</style>
