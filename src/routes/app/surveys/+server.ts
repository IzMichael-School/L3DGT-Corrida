import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Get list of surveys
export const GET: RequestHandler = async ({ locals }) => {
    const surveys = await locals.pb.collection('surveys').getFullList(200, {
        filter: `owner.id = "${locals.user?.id}"`,
    });
    return json({ surveys });
};

// Create survey
export const POST: RequestHandler = async ({ locals }) => {
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    const survey = await locals.pb.collection('surveys').create({
        title: 'Untitled Survey',
        questions: [],
        owner: locals.user.id,
    });
    return json(survey);
};
