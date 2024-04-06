import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AnswersResponse, RoomsResponse, SurveysResponse } from '$lib/pocketbase-types';
import type { Question } from '$lib/pocketbase';

// Run on page load
export const load: PageServerLoad = async ({ locals, params }) => {
    // Require user authentication
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    let room, answers, surveys;

    try {
        // Get room from url param
        room = await locals.pb.collection('rooms').getOne<RoomsResponse<Question[]>>(params.id);
        // Get answers from selected room
        answers = await locals.pb.collection('answers').getFullList<
            AnswersResponse<
                {
                    [id: string]: string;
                },
                SurveysResponse<Question[]>
            >
        >(200, {
            filter: `room = "${room.id}"`,
            sort: '-created',
        });
        // Get surveys for picker
        surveys = await locals.pb.collection('surveys').getFullList<SurveysResponse<Question[]>>(200, {
            filter: `owner.id = "${locals.user?.id}"`,
            sort: 'title',
        });
    } catch (err) {
        if (!room?.id) error(404, "Couldn't find the requested room.");
    }

    // If user doesn't own room, error
    if (locals.user.id != room.owner) return error(403, 'You do not have permission to access this resource.');

    return { room, answers, surveys };
};
