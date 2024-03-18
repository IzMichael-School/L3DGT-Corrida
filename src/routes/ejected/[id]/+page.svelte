<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import type { RecordSubscription, UnsubscribeFunc } from 'pocketbase';
    import { pb, type Question } from '$lib/pocketbase';
    import type { AnswersResponse, SurveysResponse } from '$lib/pocketbase-types';
    import * as Toast from '$lib/toasts/toast';
    import Button from '$lib/Button.svelte';
    import IndividualAnswers from '$lib/IndividualAnswers.svelte';
    import AggregateAnswers from '$lib/AggregateAnswers.svelte';

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

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    import type { PageData } from './$types';
    export let data: PageData;

    let tab = 'code';
</script>

<svelte:head>
    <title>Live Survey Results | Voix</title>
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center justify-start overflow-hidden bg-slate-100">
    <div class="flex h-16 w-full shrink-0 flex-row items-center justify-start gap-10 bg-stone-100 p-2">
        <div class="flex min-w-fit flex-row items-center justify-start">
            <Button variant="secondary" class="mr-5 w-auto" on:click={() => toggleFullScreen()}>
                <img src="/assets/icons/arrows-maximize.svg" alt="Maximise Icon" class="h-7 w-7" />
            </Button>
            <div class="flex h-full flex-row items-center justify-center gap-5">
                {#each data.room.code as char}
                    <span class="text-3xl font-bold">{char}</span>
                {/each}
                <a href="https://izmm.uk/voix" class="ml-5 text-xl font-bold underline">izmm.uk/voix</a>
            </div>
        </div>

        <div class="flex min-w-[32rem] flex-1 flex-row items-center gap-2">
            <Button
                variant={tab == 'code' ? 'primary' : 'secondary'}
                class="w-auto flex-1"
                on:click={() => (tab = 'code')}
            >
                Join Instructions
            </Button>

            <Button
                variant={tab == 'individual' ? 'primary' : 'secondary'}
                class="w-auto flex-1"
                on:click={() => (tab = 'individual')}
            >
                Individual Answers
            </Button>

            <Button
                variant={tab == 'aggregate' ? 'primary' : 'secondary'}
                class="w-auto flex-1"
                on:click={() => (tab = 'aggregate')}
            >
                Aggregated Data
            </Button>
        </div>
    </div>

    {#if tab == 'code'}
        <div class="flex h-full flex-1 flex-col items-center justify-center gap-16">
            <div class="flex w-full flex-row items-center justify-evenly">
                {#each data.room.code as char}
                    <span class="text-9xl font-bold">{char}</span>
                {/each}
            </div>
            <h2 class="text-5xl">
                Join using this code at
                <a href="https://izmm.uk/voix" class="font-bold underline">izmm.uk/voix</a>
            </h2>
        </div>
    {:else if tab == 'individual'}
        <div class="grid max-h-full w-full grid-cols-2 gap-5 overflow-auto p-5">
            <IndividualAnswers answers={data.answers ?? []} />
        </div>
    {:else if tab == 'aggregate'}
        <div class="flex max-h-full w-full flex-col items-center justify-start gap-5 overflow-auto p-5">
            <AggregateAnswers answers={data.answers ?? []} />
        </div>
    {/if}
</div>

<style></style>
