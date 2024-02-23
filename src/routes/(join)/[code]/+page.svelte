<script lang="ts">
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import { pb } from '$lib/pocketbase';
    import { onDestroy, onMount } from 'svelte';
    import dayjs from 'dayjs';

    import ShortText from '$lib/questions/ShortText.svelte';
    import LongText from '$lib/questions/LongText.svelte';
    import Number from '$lib/questions/Number.svelte';
    import Boolean from '$lib/questions/Boolean.svelte';
    import Rating from '$lib/questions/Rating.svelte';
    import Radio from '$lib/questions/Radio.svelte';
    import Checkboxes from '$lib/questions/Checkboxes.svelte';

    import type { PageData } from './$types';
    import type { UnsubscribeFunc } from 'pocketbase';
    export let data: PageData;

    let unsubscribe: UnsubscribeFunc,
        answers: {
            [key: string]: string | undefined;
        } = {},
        nickname = '',
        ready = false,
        completed = false,
        message = '',
        submitting = false,
        submitted = false;

    onMount(async () => {
        answers = Object.fromEntries(
            (data.expand?.survey.questions ?? []).map((a: { id: string }) => {
                return [a.id, ''];
            })
        );

        unsubscribe = await pb.collection('rooms').subscribe(data.id, async () => {
            data = await pb.collection('rooms').getOne(data.id, {
                expand: 'survey,owner',
            });
        });

        ready = true;
        checkRequired();
    });

    onDestroy(() => {
        unsubscribe?.();
    });

    function checkRequired() {
        if (!data.expand?.survey.questions) return false;
        let tests: boolean[] = [];
        for (const b of data.expand?.survey.questions.filter(
            (a: { id: string; required: boolean }) => a.required == true
        ) ?? []) {
            tests.push(answers[b.id] != '');
        }
        return !tests.includes(false);
    }

    function download(filename: string, text: string) {
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/markdown;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
</script>

<svelte:head>
    <title>Survey | Voix</title>
</svelte:head>

<svelte:window on:keyup={() => (completed = checkRequired())} />

<div class="flex h-screen w-screen flex-row items-center justify-between overflow-hidden">
    <section class="relative hidden h-full flex-1 items-center justify-center shadow-inner lg:flex">
        <img
            src={pb.files.getUrl(data, data.banner) || '/assets/img/microphone-unsplash.jpg'}
            alt="{data.title}'s Banner Image"
            class="h-full w-full object-cover"
        />
        {#if !data.banner}
            <div class="absolute inset-0 z-10 h-full w-full bg-purple-500/20" />
        {/if}
    </section>

    {#if data.state == 'waiting'}
        <section class="relative flex h-full flex-1 flex-col items-center justify-center shadow-lg">
            <a href="/" class="absolute left-0 top-0 w-full p-2 text-left hover:underline">&leftarrow; Return Home</a>

            <div class="max-h-[25vh] w-full lg:hidden">
                <img
                    src={pb.files.getUrl(data, data.banner) || '/assets/img/microphone-unsplash.jpg'}
                    alt="{data.title}'s Banner Image"
                    class="h-full w-full object-cover"
                />
                {#if !data.banner}
                    <div class="absolute inset-0 z-10 h-full w-full bg-purple-500/20" />
                {/if}
            </div>
            <div class="flex flex-1 flex-col items-center justify-center px-5 py-2 lg:w-2/3 lg:px-0">
                <h1 class="text-3xl font-bold">{data.title}</h1>
                <h2 class="mt-1 text-xl font-bold">
                    hosted by <img
                        src={pb.files.getUrl(data.expand?.owner, data.expand?.owner.avatar)}
                        class="mb-1 ml-2 inline-block h-7 w-7 rounded-full"
                        alt="{data.expand?.owner.displayname}'s Profile Picture"
                    />
                    {data.expand?.owner.displayname}
                </h2>

                <hr class="my-8 w-full border-t-2" />

                <p class="w-full pl-1 font-bold">Your Nickname</p>
                <TextInput bind:value={nickname} variant="filled" class="w-full" placeholder="What do we call you?" />

                <h2 class="mt-10 text-xl font-bold">Sit Tight! We'll be starting soon.</h2>
            </div>
        </section>
    {:else if data.state == 'active' && !submitted}
        <section class="flex h-full max-h-full flex-1 flex-col items-center justify-start overflow-auto shadow-lg">
            <div class="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-10 lg:w-2/3 lg:px-0">
                <h1 class="text-3xl font-bold">{data.title}</h1>
                <h2 class="-mt-4 text-xl font-bold">
                    hosted by <img
                        src={pb.files.getUrl(data.expand?.owner, data.expand?.owner.avatar)}
                        class="w-7ml-2 mb-1 inline-block h-7 rounded-full"
                        alt="{data.expand?.owner.displayname}'s Profile Picture"
                    />
                    {data.expand?.owner.displayname}
                </h2>

                <hr class="my-8 w-full border-t-2" />

                <p class="w-full pl-1 font-bold">Your Nickname</p>
                <TextInput
                    bind:value={nickname}
                    variant="filled"
                    class="-mt-4 mb-10 w-full"
                    placeholder="What do we call you?"
                />

                {#if ready}
                    {#each data.expand?.survey.questions ?? [] as question, i}
                        {#if question.type == 'short-text'}
                            <ShortText {i} {question} bind:answer={answers[question.id]} />
                        {:else if question.type == 'long-text'}
                            <LongText {i} {question} bind:answer={answers[question.id]} />
                        {:else if question.type == 'number'}
                            <Number {i} {question} bind:answer={answers[question.id]} />
                        {:else if question.type == 'boolean'}
                            <Boolean {i} {question} bind:answer={answers[question.id]} />
                        {:else if question.type == 'rating'}
                            <Rating {i} {question} bind:answer={answers[question.id]} />
                        {:else if question.type == 'radio'}
                            <Radio {i} {question} bind:answer={answers[question.id]} />
                        {:else if question.type == 'checkboxes'}
                            <Checkboxes {i} {question} bind:answer={answers[question.id]} />
                        {/if}
                    {/each}

                    <Button
                        variant={completed && !submitting ? 'primary' : 'secondary'}
                        class={completed ? 'cursor-pointer' : 'cursor-not-allowed'}
                        on:click={async () => {
                            submitting = true;
                            message = '';
                            if (!completed)
                                return (message = 'Please fill out the required fields.'), (submitting = false);
                            await fetch('/' + data.code, {
                                method: 'POST',
                                body: JSON.stringify({
                                    name: nickname,
                                    answers: answers,
                                    room: data.id,
                                    survey: data.expand?.survey ?? {},
                                }),
                            });
                            submitted = true;
                        }}
                    >
                        {submitting ? 'Submitting...' : 'Submit Survey'}
                    </Button>
                    {#if message.length > 0}
                        <p class="w-full text-center font-bold text-red-700">{message}</p>
                    {/if}
                {/if}
            </div>
        </section>
    {:else if data.state != 'closed' && submitted}
        <section class="flex h-full max-h-full flex-1 flex-col items-center justify-start overflow-auto shadow-lg">
            <div class="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-10 lg:w-2/3 lg:px-0">
                <h1 class="text-3xl font-bold">Thanks for Participating!</h1>

                <!-- <h2 class="mt-1 text-xl font-bold"></h2> -->

                <Button
                    on:click={() => {
                        let timestamp = dayjs();
                        download(
                            `voix-submission-${timestamp.format('YYYYMMDD-HHmmss')}.md`,
                            `**${data.title} Submission - ${timestamp.format('DD/MM/YYYY HH:mm:ss')}**\n` +
                                `Nickname: *${nickname}*\n\n` +
                                (data.expand?.survey.questions ?? [])
                                    .map((a, i) => {
                                        return `${i + 1}. ${a.label}\n*${(answers[a.id] ?? '')
                                            .split('\n')
                                            .join('*\n*')}*`;
                                    })
                                    .join('\n\n')
                        );
                    }}
                >
                    Download your Answers
                </Button>

                <a href="/" class="contents">
                    <Button variant="secondary">Return Home</Button>
                </a>
            </div>
        </section>
    {:else if data.state == 'closed'}
        <section class="flex h-full max-h-full flex-1 flex-col items-center justify-start overflow-auto shadow-lg">
            <div class="flex flex-1 flex-col items-center justify-center gap-5 px-5 py-10 lg:w-2/3 lg:px-0">
                <h1 class="text-3xl font-bold">This room has now closed.</h1>
                <h2 class="mt-1 text-xl font-bold">Thanks for Participating!</h2>

                {#if submitted}
                    <Button
                        on:click={() => {
                            let timestamp = dayjs();
                            download(
                                `voix-submission-${timestamp.format('YYYYMMDD-HHmmss')}.md`,
                                `**${data.title} Submission - ${timestamp.format('DD/MM/YYYY HH:mm:ss')}**\n` +
                                    `Nickname: *${nickname}*\n\n` +
                                    (data.expand?.survey.questions ?? [])
                                        .map((a, i) => {
                                            return `${i + 1}. ${a.label}\n*${(answers[a.id] ?? '')
                                                .split('\n')
                                                .join('*\n*')}*`;
                                        })
                                        .join('\n\n')
                            );
                        }}
                    >
                        Download your Answers
                    </Button>
                {/if}

                <a href="/" class="contents">
                    <Button variant="secondary">Return Home</Button>
                </a>
            </div>
        </section>
    {/if}
</div>

<style>
</style>
