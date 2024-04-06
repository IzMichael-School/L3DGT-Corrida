import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AnswersResponse, RoomsResponse, SurveysResponse } from '$lib/pocketbase-types';
import type { Question } from '$lib/pocketbase';

// Run on page load
export const load: PageServerLoad = async ({ locals, params }) => {
    // Require login
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    let room, answers;

    try {
        // Get room data from code in url
        room = await locals.pb.collection('rooms').getOne<RoomsResponse<Question[]>>(params.id);
        // Get answers from database
        answers = await locals.pb.collection('answers').getFullList<
            AnswersResponse<
                {
                    [id: string]: string;
                },
                SurveysResponse<Question[]>
            >
        >(200, {
            // only get answers from current room
            filter: `room = "${room.id}"`,
            sort: '-created',
        });
    } catch (err) {
        if (!room?.id) error(404, "Couldn't find the requested room.");
    }

    // If user is not host, error
    if (locals.user.id != room.owner) return error(403, 'You do not have permission to access this resource.');

    return { room, answers };
};
