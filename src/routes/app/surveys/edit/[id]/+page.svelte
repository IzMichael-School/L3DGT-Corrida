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

    import type { PageData } from './$types';
    export let data: PageData;

    function swap(array: Question[], x: number, y: number) {
        var b = array[x];
        array[x] = array[y];
        array[y] = b;
        return array;
    }
</script>

<div class="flex h-full max-h-full w-full flex-row items-center justify-center gap-3">
    <div class="flex h-full w-1/3 flex-col items-center justify-start rounded-lg bg-white p-5 shadow">
        <h1 class="text-2xl font-bold">Survey Editor</h1>

        <p class="mt-5 w-full text-left text-sm">Survey Title</p>
        <TextInput bind:value={data.title} class="mb-0 w-full" />

        <span class="flex-1" />

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

    <div class="flex h-full max-h-full flex-1 flex-col items-center justify-start gap-3 overflow-y-auto">
        <div class="w-full rounded-lg bg-white p-5 shadow">
            <h2 class="text-xl font-bold">Questions ({data.questions?.length})</h2>
        </div>

        {#each data.questions ?? [] as question, i (question.id)}
            <div
                class="w-full rounded-lg bg-white p-5 shadow transition-all duration-300 ease-in-out"
                animate:flip={{ duration: 300 }}
            >
                <p class="font-bold">Question {i + 1}.</p>

                <div class="mt-3 flex w-full flex-row items-center justify-between gap-5 text-sm">
                    <p class="flex-1">Question Label</p>
                    <p class="min-w-[12rem]">Question Type</p>
                </div>
                <div class="mt-1 flex w-full flex-row items-center justify-between gap-5">
                    <TextInput bind:value={question.label} class="my-0 flex-1" placeholder="Ask any question..." />

                    <select
                        bind:value={question.type}
                        class="min-w-[12rem] rounded-lg border border-gray-300 bg-gray-100 p-2.5 font-normal text-black outline-none hover:bg-gray-200"
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

                {#if (question.type == 'number' || question.type == 'rating') && question.options?.max != undefined && question.options?.min != undefined}
                    <div class="mt-3 flex w-full flex-row items-center justify-start gap-5 text-sm">
                        <p class="w-[12rem]">Maximum Value</p>
                        <p class="w-[12rem]">Minimum Value</p>
                    </div>
                    <div class="mt-1 flex w-full flex-row items-center justify-start gap-5">
                        <TextInput bind:value={question.options['max']} class="w-[12rem]" type="number" />
                        <TextInput bind:value={question.options['min']} class="w-[12rem]" type="number" />
                    </div>
                {/if}

                {#if question.type == 'boolean' && question.options?.true != undefined && question.options?.false != undefined}
                    <div class="mt-3 flex w-full flex-row items-center justify-start gap-5 text-sm">
                        <p class="w-[12rem]">True Label</p>
                        <p class="w-[12rem]">False Label</p>
                    </div>
                    <div class="mt-1 flex w-full flex-row items-center justify-start gap-5">
                        <TextInput bind:value={question.options['true']} class="w-[12rem]" />
                        <TextInput bind:value={question.options['false']} class="w-[12rem]" />
                    </div>
                {/if}

                {#if (question.type == 'radio' || question.type == 'checkboxes') && question.options != undefined}
                    <div class="mt-3 grid w-full grid-cols-3 gap-3">
                        {#each Object.keys(question.options) as entry (entry)}
                            <div
                                class="flex flex-col items-center justify-center gap-1"
                                animate:flip={{ duration: 300 }}
                            >
                                <p class="w-full">Option Label</p>
                                <div class="flex w-full flex-row items-center justify-between gap-1">
                                    <TextInput bind:value={question.options[entry]} class="mb-0 flex-1" />
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

                        <div class="flex flex-col items-center justify-end">
                            <Button
                                variant="secondary"
                                class="h-fit text-base"
                                on:click={() => {
                                    question.options[nanoid()] = '';
                                }}
                            >
                                Add Option
                            </Button>
                        </div>
                    </div>
                {/if}

                <div class="mt-5 flex w-full flex-row items-center justify-end gap-3">
                    <p class="w-fit">Required Question</p>
                    <BooleanInput
                        variant="switch"
                        class="rounded-full"
                        classInner="rounded-full"
                        bind:value={question.required}
                    />

                    <span class="block flex-1" />

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
