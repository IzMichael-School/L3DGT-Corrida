<script lang="ts">
    import { flip } from 'svelte/animate';
    import type { Question } from './pocketbase';
    import type { AnswersResponse, SurveysResponse } from './pocketbase-types';

    import { Chart } from 'svelte-chartjs';
    import { Pie } from 'svelte-chartjs';
    import { Bar } from 'svelte-chartjs';

    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale,
        BarElement,
        LinearScale,
    } from 'chart.js';
    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, BarElement, LinearScale);
    import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
    ChartJS.register(WordCloudController, WordElement);

    let rainbow = ['#ff595e', '#ff924c', '#ffca3a', '#c5ca30', '#8ac926', '#52a675', '#1982c4', '#4267ac', '#6a4c93'];

    type Answers = AnswersResponse<
        {
            [id: string]: string;
        },
        SurveysResponse<Question[]>
    >[];

    function getQuestionAnswers(answers: Answers) {
        let allQuestions = answers
            .map((a) => a.survey?.questions ?? [])
            .flat()
            .filter((v, i, s) => {
                return s.findIndex((vi) => vi.id == v.id) == i;
            });
        return allQuestions.map((q) => {
            return { question: q, answers: answers.map((a) => (a.answers ?? {})[q.id] ?? '').filter((a) => a != '') };
        }) as { question: Question; answers: string[] }[];
    }

    function shuffle<T>(array: T[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function range(min = 0, max: number) {
        return [...Array(max - (min - 1)).keys()].map((i) => i + min);
    }

    export let answers: Answers;
</script>

<!-- TODO: #each questions with graphs, etc. -->

{#each getQuestionAnswers(answers) as pair (pair.question.id)}
    <div class="w-full rounded-lg bg-white p-5 shadow" animate:flip={{ duration: 300 }}>
        <p class="mb-3 font-bold">{pair.question.label}</p>

        <div class="flex w-full flex-row items-center justify-between">
            <div class="h-96 flex-1 overflow-hidden">
                {#if pair.question.type == 'short-text' || pair.question.type == 'long-text'}
                    <Chart
                        type={WordCloudController.id}
                        data={{
                            labels: Object.keys(
                                pair.answers
                                    .join(' ')
                                    .split(' ')
                                    .reduce(function (acc, curr) {
                                        return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
                                    }, {})
                            ),
                            datasets: [
                                {
                                    data: Object.values(
                                        pair.answers
                                            .join(' ')
                                            .split(' ')
                                            .reduce(function (acc, curr) {
                                                return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
                                            }, {})
                                    ).map((e) => e * 20),
                                    color: shuffle(rainbow),
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                        }}
                    />
                {:else if pair.question.type == 'boolean'}
                    <Pie
                        data={{
                            labels: Object.values(pair.question.options).sort(),
                            datasets: [
                                {
                                    data: Object.values(pair.question.options)
                                        .sort()
                                        .map((q) => pair.answers.filter((a) => a == q).length),
                                    backgroundColor: ['#8ac926', '#ff595e'],
                                },
                            ],
                        }}
                        options={{ responsive: true, maintainAspectRatio: false }}
                    />
                {:else if pair.question.type == 'number' || pair.question.type == 'rating'}
                    <Bar
                        data={{
                            labels: range(
                                parseInt(pair.question.options?.min) ?? 0,
                                parseInt(pair.question.options?.max) ?? 0
                            ).sort((a, b) => (a > b ? 1 : -1)),
                            datasets: [
                                {
                                    data: range(
                                        parseInt(pair.question.options?.min) ?? 0,
                                        parseInt(pair.question.options?.max) ?? 0
                                    )
                                        .sort((a, b) => (a > b ? 1 : -1))
                                        .map((q) => pair.answers.filter((a) => a == q.toString()).length),
                                    backgroundColor: shuffle(rainbow),
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                        }}
                    />
                {:else if pair.question.type == 'radio'}
                    <Bar
                        data={{
                            labels: Object.values(pair.question.options).sort(),
                            datasets: [
                                {
                                    data: Object.values(pair.question.options)
                                        .sort()
                                        .map((q) => pair.answers.filter((a) => a == q).length),
                                    backgroundColor: shuffle(rainbow),
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                        }}
                    />
                {:else if pair.question.type == 'checkboxes'}
                    <Bar
                        data={{
                            labels: Object.values(pair.question.options).sort(),
                            datasets: [
                                {
                                    data: Object.values(pair.question.options)
                                        .sort()
                                        .map((q) => pair.answers.filter((a) => a.split(', ').includes(q)).length),
                                    backgroundColor: shuffle(rainbow),
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                        }}
                    />
                {/if}
            </div>

            <div class="ml-5 flex h-full max-h-full w-1/3 flex-col items-center justify-start overflow-auto">
                {#each pair.answers as answer}
                    <p>{answer}</p>
                {/each}
            </div>
        </div>

        <!-- <p>Q: {pair.question.label}</p>
        <p>As: {pair.answers.join(', ')}</p> -->
    </div>
{/each}

<style>
</style>
