<script lang="ts">
    import dayjs from 'dayjs';
    import { flip } from 'svelte/animate';
    import type { Question } from '$lib/pocketbase';
    import type { AnswersResponse, SurveysResponse } from './pocketbase-types';

    function pairAnswers(answer: AnswersResponse<{ [id: string]: string }, SurveysResponse>) {
        return Object.entries(answer.answers ?? {}).sort((a, b) =>
            (answer.survey?.questions as Question[]).map((c) => c.id).indexOf(a[0]) >
            (answer.survey?.questions as Question[]).map((c) => c.id).indexOf(b[0])
                ? 1
                : -1
        );
    }

    export let answers: AnswersResponse<
        {
            [id: string]: string;
        },
        SurveysResponse
    >[];
</script>

{#each answers ?? [] as answer (answer.id)}
    <div class="w-full rounded-lg bg-white p-5 shadow" animate:flip={{ duration: 300 }}>
        <p class="mb-1 font-bold">{answer.name || 'Anonymous'}</p>
        {#each pairAnswers(answer) as entry}
            <p>
                <b>
                    {(answer.survey?.questions ?? []).find((a) => a.id == entry[0])?.label ?? 'Question Missing'}:
                </b>
                {entry[1]}
            </p>
        {/each}
        <p class="mt-2 text-sm italic">Submitted on {dayjs(answer.created).format('DD/MM/YYYY @ HH:mm:ss')}</p>
    </div>
{/each}

<style>
</style>
