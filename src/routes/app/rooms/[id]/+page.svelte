<script lang="ts">
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import { RoomsStateOptions, type AnswersResponse, type SurveysResponse } from '$lib/pocketbase-types';
    import { onDestroy, onMount } from 'svelte';
    import { pb, type Question } from '$lib/pocketbase';
    import type { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
    import SurveyPicker from '$lib/SurveyPicker.svelte';
    import { goto } from '$app/navigation';
    import * as Toast from '$lib/toasts/toast';
    import Confirm from '$lib/Confirm.svelte';
    import IndividualAnswers from '$lib/IndividualAnswers.svelte';
    import AggregateAnswers from '$lib/AggregateAnswers.svelte';

    // Get data from server load function
    import type { PageData } from './$types';
    export let data: PageData;

    // Handle auto-updating subscription
    let unsubscribe: UnsubscribeFunc;

    onMount(async () => {
        unsubscribe = await pb
            .collection('answers')
            .subscribe(
                '*',
                async (
                    e: RecordSubscription<AnswersResponse<{ [id: string]: string }, SurveysResponse<Question[]>>>
                ) => {
                    if (e.action == 'create') {
                        data.answers?.push(e.record);
                        // eslint-disable-next-line no-self-assign
                        data.answers = data.answers;

                        // Send toast notification when new answer is submitted
                        Toast.add('New Response from ' + e.record.name, {
                            type: 'info',
                        });
                    }
                }
            );
    });

    onDestroy(() => {
        unsubscribe?.();
    });

    // Tab controller
    let tab = 'individual';
</script>

<svelte:head>
    <title>Editing Room | Voix</title>
</svelte:head>

<div
    class="flex w-full flex-col items-center justify-start gap-3 lg:h-full lg:max-h-full lg:flex-row lg:justify-center"
>
    <div class="flex w-full flex-col items-center justify-start gap-3 lg:h-full lg:w-1/3">
        <!-- Room data editor -->
        <div class="flex w-full flex-1 flex-col items-center justify-start rounded-lg bg-white p-5 shadow">
            <h1 class="text-2xl font-bold">Room Editor</h1>

            <p class="mt-5 w-full text-left text-sm">Room Title</p>
            <TextInput bind:value={data.room.title} class="mb-0 w-full" />

            <p class="mt-5 w-full text-left text-sm">Room Code</p>
            <div class="flex w-full flex-row items-center justify-evenly text-4xl font-bold">
                {#each data.room.code.split('') as char}
                    <p>{char}</p>
                {/each}
            </div>

            <!-- Survey picker -->
            <p class="mb-1 mt-5 w-full text-left text-sm">Selected Survey</p>
            <SurveyPicker
                bind:value={data.room.survey}
                surveys={data.surveys ?? []}
                on:select={async () => {
                    let working = Toast.add('Saving Survey Selection...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify(data.room),
                    });
                    Toast.dismiss(working);
                    Toast.add('Saved Changes.', {
                        type: 'success',
                    });
                }}
            />

            <span class="min-h-5 flex-1" />

            <!-- Delete room, with confirmation -->
            <Confirm
                action={async () => {
                    let working = Toast.add('Deleting...', {
                        type: 'warning',
                        timeout: 60 * 60 * 1000,
                    });
                    goto('/app/rooms');
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'DELETE',
                    });
                    Toast.dismiss(working);
                    Toast.add('Deleted Room.', {
                        type: 'success',
                    });
                }}
            >
                <Button variant="danger" class="mb-2">Delete Room</Button>
            </Confirm>

            <!-- Save room changes -->
            <Button
                variant="primary"
                on:click={async () => {
                    let working = Toast.add('Saving...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify(data.room),
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

        <div class="flex w-full flex-col items-center justify-start rounded-lg bg-white p-5 shadow">
            <p class="w-full text-left text-sm">Room States</p>
            <!-- Set room to waiting -->
            <Button
                class="mt-1 w-full"
                variant={data.room.state == 'waiting' ? 'primary' : 'secondary'}
                on:click={async () => {
                    // Send toast notif for setting
                    let working = Toast.add('Setting to "Waiting"...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    // Send db request, via local API
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            state: 'waiting',
                        }),
                    });
                    // Set local variable state
                    data.room.state = RoomsStateOptions.waiting;
                    // Hide working toast, send completed toast
                    Toast.dismiss(working);
                    Toast.add('Set room to "Waiting".', {
                        type: 'success',
                    });
                }}
            >
                Waiting
            </Button>
            <!-- Set room to active -->
            <Button
                class="mt-2 w-full"
                variant={data.room.state == 'active' ? 'primary' : 'secondary'}
                on:click={async () => {
                    // Send toast notif for setting
                    let working = Toast.add('Setting to "Active"...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    // If room has selected survey
                    if (!data.room.survey) {
                        Toast.dismiss(working);
                        Toast.add('You must pick a survey first.', {
                            type: 'danger',
                        });
                        return;
                    }
                    // Send db request, via local API
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            state: 'active',
                        }),
                    });
                    // Set local variable state
                    data.room.state = RoomsStateOptions.active;
                    // Hide working toast, send completed toast
                    Toast.dismiss(working);
                    Toast.add('Set room to "Active".', {
                        type: 'success',
                    });
                }}
            >
                Active
            </Button>
            <!-- Set room to closed -->
            <Button
                class="mt-2 w-full"
                variant={data.room.state == 'closed' ? 'primary' : 'secondary'}
                on:click={async () => {
                    // Send toast notif for setting
                    let working = Toast.add('Setting to "Closed"...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    // If room has selected survey
                    if (!data.room.survey) {
                        Toast.dismiss(working);
                        Toast.add('You must pick a survey first.', {
                            type: 'danger',
                        });
                        return;
                    }
                    // Send db request, via local API
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            state: 'closed',
                        }),
                    });
                    // Set local variable state
                    data.room.state = RoomsStateOptions.closed;
                    // Hide working toast, send completed toast
                    Toast.dismiss(working);
                    Toast.add('Set room to "Closed".', {
                        type: 'success',
                    });
                }}
            >
                Closed
            </Button>
        </div>
    </div>

    <div
        class="flex w-full flex-col items-center justify-start gap-3 lg:h-full lg:max-h-full lg:w-auto lg:flex-1 lg:overflow-y-auto"
    >
        <!-- Tab selectors -->
        <div class="flex w-full flex-row items-center justify-between gap-3">
            <Button
                variant="secondary"
                class="w-auto"
                on:click={() => {
                    window.open('/ejected/' + data.room.id, 'ejected', 'width=1280,height=720');
                }}
            >
                <img src="/assets/icons/stack-pop.svg" alt="Pop Out Icon" class="h-7 w-7" />
            </Button>
            <Button
                variant={tab == 'individual' ? 'primary' : 'secondary'}
                class="w-auto flex-1"
                on:click={() => (tab = 'individual')}
            >
                Individual
                <span class="hidden lg:inline">&hairsp; Answers ({data.answers?.length})</span>
            </Button>
            <Button
                variant={tab == 'aggregate' ? 'primary' : 'secondary'}
                class="w-auto flex-1"
                on:click={() => (tab = 'aggregate')}
            >
                Aggregate
                <span class="hidden lg:inline">d Data</span>
            </Button>
        </div>

        <!-- Answer format tabs -->
        {#if tab == 'individual'}
            <IndividualAnswers answers={data.answers ?? []} />
        {:else if tab == 'aggregate'}
            <AggregateAnswers answers={data.answers ?? []} />
        {/if}
    </div>
</div>

<style>
</style>
