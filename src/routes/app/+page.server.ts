import type { RoomsResponse, SurveysResponse, UsersResponse } from '$lib/pocketbase-types';
import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

// Run on page load
export const load: PageServerLoad = ({ locals }) => {
    return {
        // Copy of current user data
        user: structuredClone(locals.user) ?? {},
        // live current user data
        live: locals.user ?? {},
        // recent room and survey
        recents: {
            room: locals.pb.collection('rooms').getFirstListItem(`owner.id = "${locals.user?.id}"`, {
                sort: '-updated',
            }),
            survey: locals.pb.collection('surveys').getFirstListItem(`owner.id = "${locals.user?.id}"`, {
                sort: '-updated',
            }),
        },
    } as {
        // typescript types for return
        user: UsersResponse;
        live: UsersResponse;
        recents: {
            room: Promise<RoomsResponse>;
            survey: Promise<SurveysResponse>;
        };
    };
};

// Form actions
export const actions: Actions = {
    // Update profile
    profile: async ({ locals, request }) => {
        // Require user login
        if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

        // Get formdata as JSON
        const data = Object.fromEntries(await request.formData()) as {
            id: string;
            username: string;
            displayname: string;
            gravatar: ('on' | undefined) | boolean;
        };

        // Convert checkbox to boolean
        data.gravatar = data.gravatar == 'on' ? true : false;

        // Try update on db, return relevant data if failed
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
    // Update email
    email: async ({ locals, request }) => {
        // Require user login
        if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

        // Get formdata as JSON
        const data = Object.fromEntries(await request.formData()) as {
            email: string;
        };

        // Try send confirmation, return relevant data if failed
        try {
            await locals.pb.collection('users').requestEmailChange(data.email);
        } catch (e: any) {
            return fail(400, { error: e?.response.data.message });
        }

        return;
    },
    // Update password
    password: async ({ locals }) => {
        // Require user login
        if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

        // Try send confirmation, return relevant data if failed
        try {
            await locals.pb.collection('users').requestPasswordReset(locals.user.email);
        } catch (e: any) {
            return fail(400, { error: e?.response.data.message });
        }

        return;
    },
};
