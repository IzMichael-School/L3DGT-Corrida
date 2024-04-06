import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RoomsResponse, SurveysResponse, UsersResponse } from '$lib/pocketbase-types';
import type { Question } from '$lib/pocketbase';

// Run on server load
export const load: PageServerLoad = async ({ locals, params }) => {
    let room;
    try {
        // Get room matching code in url, error if not found
        room = await locals.pb.collection('rooms').getFirstListItem<
            RoomsResponse<{
                owner: UsersResponse;
                survey: SurveysResponse<Question[]>;
            }>
        >('code = "' + params.code + '"', {
            expand: 'survey,owner',
        });
    } catch (err) {
        if (!room?.id) error(404, "Couldn't find a room with this code.");
    }
    return room;
};
