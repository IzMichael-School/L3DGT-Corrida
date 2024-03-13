import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AnswersResponse, RoomsResponse, SurveysResponse } from '$lib/pocketbase-types';
import type { Question } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    let room, answers, surveys;

    try {
        room = await locals.pb.collection('rooms').getOne<RoomsResponse<Question[]>>(params.id);
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
        surveys = await locals.pb.collection('surveys').getFullList<SurveysResponse<Question[]>>(200);
    } catch (err) {
        if (!room?.id) error(404, "Couldn't find the requested room.");
    }

    if (locals.user.id != room.owner) return error(403, 'You do not have permission to access this resource.');

    return { room, answers, surveys };
};
