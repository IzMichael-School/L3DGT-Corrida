import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { SurveysResponse } from '$lib/pocketbase-types';
import type { Question } from '$lib/pocketbase';

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    let survey;

    try {
        survey = await locals.pb.collection('surveys').getOne<SurveysResponse<Question[]>>(params.id);
    } catch (err) {
        if (!survey?.id) error(404, "Couldn't find the requested survey.");
    }

    if (locals.user.id != survey.owner) return error(403, 'You do not have permission to access this resource.');

    return survey;
};
