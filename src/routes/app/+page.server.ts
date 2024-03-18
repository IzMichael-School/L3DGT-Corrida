import type { RoomsResponse, SurveysResponse, UsersResponse } from '$lib/pocketbase-types';
import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

export const load: PageServerLoad = ({ locals }) => {
    return {
        user: structuredClone(locals.user) ?? {},
        live: locals.user ?? {},
        recents: {
            room: locals.pb.collection('rooms').getFirstListItem(`owner.id = "${locals.user?.id}"`, {
                sort: '-updated',
            }),
            survey: locals.pb.collection('surveys').getFirstListItem(`owner.id = "${locals.user?.id}"`, {
                sort: '-updated',
            }),
        },
    } as {
        user: UsersResponse;
        live: UsersResponse;
        recents: {
            room: Promise<RoomsResponse>;
            survey: Promise<SurveysResponse>;
        };
    };
};

export const actions: Actions = {
    default: async ({ locals, request }) => {
        if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

        const data = Object.fromEntries(await request.formData()) as {
            id: string;
            username: string;
            displayname: string;
        };

        try {
            await locals.pb.collection('users').update(data.id, data);
        } catch (e: any) {
            console.error(e?.response.data);

            if (e?.response.data?.username) return fail(400, { error: e.response.data.username.message });
            if (e?.response.data?.email) return fail(400, { error: e.response.data.email.message });
            if (e?.response.data?.password) return fail(400, { error: e.response.data.password.message });

            throw e;
        }

        return;
    },
};
