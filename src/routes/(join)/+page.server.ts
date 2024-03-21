import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    return { user: locals.user };
};

export const actions: Actions = {
    default: async ({ locals, request }) => {
        const data = Object.fromEntries(await request.formData()) as {
            code: string;
        };

        data.code = data.code.toUpperCase();

        // Validation
        if (!(data.code.length > 0)) return fail(400, { error: 'Check your room code input. It may be blank.' });
        if (data.code.length < 7) return fail(400, { error: 'Check your room code input. It may be too short.' });
        if (data.code.length > 7) return fail(400, { error: 'Check your room code input. It may be too long.' });

        let room;
        try {
            room = await locals.pb.collection('rooms').getFirstListItem('code = "' + data.code + '"');
        } catch (error) {
            if (!room?.id) return fail(404, { error: "Couldn't find a room with this code." });
        }

        throw redirect(303, '/' + room.code);
    },
};
