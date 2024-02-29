<script lang="ts">
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import { RoomsStateOptions, type AnswersResponse, type SurveysResponse } from '$lib/pocketbase-types';
    import { flip } from 'svelte/animate';
    import { onDestroy, onMount } from 'svelte';
    import { pb, type Question } from '$lib/pocketbase';
    import type { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
    import SurveyPicker from '$lib/SurveyPicker.svelte';
    import { goto } from '$app/navigation';
    import * as Toast from '$lib/toasts/toast';
    import Confirm from '$lib/Confirm.svelte';

    import type { PageData } from './$types';
    import dayjs from 'dayjs';
    export let data: PageData;

    let unsubscribe: UnsubscribeFunc;

    onMount(async () => {
        unsubscribe = await pb
            .collection('answers')
            .subscribe(
                '*',
                async (e: RecordSubscription<AnswersResponse<{ [id: string]: string }, SurveysResponse>>) => {
                    if (e.action == 'create') {
                        data.answers?.push(e.record);
                        // eslint-disable-next-line no-self-assign
                        data.answers = data.answers;

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

    function pairAnswers(answer: AnswersResponse<{ [id: string]: string }, SurveysResponse>) {
        return Object.entries(answer.answers ?? {}).sort((a, b) =>
            (answer.survey?.questions as Question[]).map((c) => c.id).indexOf(a[0]) >
            (answer.survey?.questions as Question[]).map((c) => c.id).indexOf(b[0])
                ? 1
                : -1
        );
    }
</script>

<div class="flex h-full max-h-full w-full flex-row items-center justify-center gap-3">
    <div class="flex h-full w-1/3 flex-col items-center justify-start gap-3">
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

            <p class="mb-1 mt-5 w-full text-left text-sm">Selected Survey</p>
            <SurveyPicker bind:value={data.room.survey} surveys={data.surveys ?? []} />

            <span class="flex-1" />

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
            <Button
                class="mt-1 w-full"
                variant={data.room.state == 'waiting' ? 'primary' : 'secondary'}
                on:click={async () => {
                    let working = Toast.add('Setting to "Waiting"...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            state: 'waiting',
                        }),
                    });
                    data.room.state = RoomsStateOptions.waiting;
                    Toast.dismiss(working);
                    Toast.add('Set room to "Waiting".', {
                        type: 'success',
                    });
                }}
            >
                Waiting
            </Button>
            <Button
                class="mt-2 w-full"
                variant={data.room.state == 'active' ? 'primary' : 'secondary'}
                on:click={async () => {
                    let working = Toast.add('Setting to "Active"...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            state: 'active',
                        }),
                    });
                    data.room.state = RoomsStateOptions.active;
                    Toast.dismiss(working);
                    Toast.add('Set room to "Active".', {
                        type: 'success',
                    });
                }}
            >
                Active
            </Button>
            <Button
                class="mt-2 w-full"
                variant={data.room.state == 'closed' ? 'primary' : 'secondary'}
                on:click={async () => {
                    let working = Toast.add('Setting to "Closed"...', {
                        type: 'info',
                        timeout: 60 * 60 * 1000,
                    });
                    await fetch('/app/rooms/' + data.room.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            state: 'closed',
                        }),
                    });
                    data.room.state = RoomsStateOptions.closed;
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

    <div class="flex h-full max-h-full flex-1 flex-col items-center justify-start gap-3 overflow-y-auto">
        <div class="w-full rounded-lg bg-white p-5 shadow">
            <h2 class="text-xl font-bold">Answers ({data.answers?.length})</h2>
        </div>

        {#each data.answers ?? [] as answer (answer.id)}
            <div class="w-full rounded-lg bg-white p-5 shadow" animate:flip={{ duration: 300 }}>
                <p class="mb-1 font-bold">{answer.name || 'Anonymous'}</p>
                {#each pairAnswers(answer) as entry}
                    <p>
                        <b>
                            {(answer.survey?.questions ?? []).find((a) => a.id == entry[0])?.label ??
                                'Question Missing'}:
                        </b>
                        {entry[1]}
                    </p>
                {/each}
                <p class="mt-2 text-sm italic">Submitted on {dayjs(answer.created).format('DD/MM/YYYY @ HH:mm:ss')}</p>
            </div>
        {/each}
    </div>
</div>

<style>
</style>
