<script lang="ts">
    import TextInput from '$lib/TextInput.svelte';
    import { getGravatar, pb } from '$lib/pocketbase';
    import Button from '$lib/Button.svelte';
    import * as Toast from '$lib/toasts/toast';
    import { goto } from '$app/navigation';
    import { applyAction, enhance } from '$app/forms';

    let saving = false,
        savingToast: string;

    import type { PageData } from './$types';
    export let data: PageData, form;
</script>

<div class="flex h-full max-h-full w-full flex-row items-center justify-center gap-3">
    <div class="flex h-full flex-1 flex-col items-center justify-start gap-5">
        <div class="flex w-full flex-col items-center justify-center rounded-lg bg-white p-5 shadow">
            <h1 class="text-center text-6xl font-bold">Welcome to Voix</h1>
        </div>

        <span class="flex-1" />

        <div class="flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-white p-5 shadow">
            <Button
                variant="primary"
                class="justify-start bg-brand-green shadow"
                on:click={async () => {
                    const created = await fetch('/app/rooms', {
                        method: 'POST',
                    }).then((res) => res.json());
                    goto('/app/rooms/' + created.id);
                }}
            >
                <img src="/assets/icons/users-group.svg" alt="Group of People Icon" class="aspect-square w-10 invert" />
                <p class="ml-5 text-xl font-bold text-white">Create new Room</p>
            </Button>

            <Button
                variant="primary"
                class="justify-start bg-brand-blue shadow"
                on:click={async () => {
                    const created = await fetch('/app/surveys', {
                        method: 'POST',
                    }).then((res) => res.json());
                    goto('/app/surveys/edit/' + created.id);
                }}
            >
                <img
                    src="/assets/icons/list-numbers.svg"
                    alt="List with Numbers Icon"
                    class="aspect-square w-10 invert"
                />
                <p class="ml-5 text-xl font-bold text-white">Create new Survey</p>
            </Button>

            <a href="/" class="contents">
                <Button variant="primary" class="justify-start bg-brand shadow">
                    <img
                        src="/assets/icons/door-enter.svg"
                        alt="Door with Arrow Pointing Inwards Icon"
                        class="aspect-square w-10 invert"
                    />
                    <p class="ml-5 text-xl font-bold text-white">Join a Room</p>
                </Button>
            </a>
        </div>

        <div class="flex w-full flex-col items-center justify-center gap-3 rounded-lg bg-white p-5 shadow">
            <a href="/rooms/{data.recents.room.id}" class="contents">
                <Button variant="primary" class="justify-start bg-brand-green shadow">
                    <img
                        src="/assets/icons/users-group.svg"
                        alt="Group of People Icon"
                        class="aspect-square w-10 invert"
                    />
                    <p class="ml-5 flex-1 text-left text-xl font-bold text-white">
                        Resume Last Room ({data.recents.room.title})
                    </p>
                </Button>
            </a>

            <a href="/surveys/edit/{data.recents.survey.title}" class="contents">
                <Button variant="primary" class="justify-start bg-brand-blue shadow">
                    <img
                        src="/assets/icons/list-numbers.svg"
                        alt="List with Numbers Icon"
                        class="aspect-square w-10 invert"
                    />
                    <p class="ml-5 flex-1 text-left text-xl font-bold text-white">
                        Edit Last Survey ({data.recents.survey.title})
                    </p>
                </Button>
            </a>
        </div>
    </div>

    <div class="flex h-full flex-1 flex-col items-center justify-start overflow-auto rounded-lg bg-white p-5 shadow">
        <div class="flex w-full flex-1 flex-col items-center justify-center">
            {#await getGravatar(data.live.email ?? '') then gravatar}
                <img src={gravatar} alt="{data.live.displayname}'s Profile Picture" class="w-1/3 rounded-full shadow" />
            {/await}
            <h1 class="mt-5 text-3xl font-bold">{data.live.displayname}</h1>
            <h2 class="mt-1 text-xl font-bold">@{data.live.username}</h2>

            <form
                method="POST"
                class="contents"
                enctype="multipart/form-data"
                use:enhance={() => {
                    return async ({ result }) => {
                        pb.authStore.loadFromCookie(document.cookie);
                        await applyAction(result);
                        saving = false;

                        Toast.dismiss(savingToast);
                        Toast.add('Saved Changes.', {
                            type: 'success',
                        });
                    };
                }}
                on:submit={() => (saving = true)}
            >
                <p class="mt-3 w-full text-left">Display Name</p>
                <TextInput bind:value={data.user.displayname} name="displayname" class="w-full" />

                <p class="mt-3 w-full text-left">Username</p>
                <TextInput bind:value={data.user.username} name="username" class="w-full" />

                <input name="id" class="hidden" value={data.user.id} />

                <Button
                    type="submit"
                    class="mt-10"
                    variant={saving ? 'secondary' : 'default'}
                    on:click={async () => {
                        savingToast = Toast.add('Saving...', {
                            type: 'info',
                            timeout: 60 * 60 * 1000,
                        });
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>

                {#if form?.error}
                    <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
                {/if}
            </form>

            <a class="mt-3 text-center text-xs italic hover:underline" href="https://gravatar.com/">
                Avatars from gravatar.com
            </a>
        </div>
    </div>
</div>

<style>
</style>
