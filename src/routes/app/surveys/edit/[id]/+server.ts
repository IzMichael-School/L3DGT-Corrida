import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Update survey data
export const PUT: RequestHandler = async ({ locals, request, params }) => {
    // Require authenticated user
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    // Parse formdata as JSON
    const body = await request.json();

    // Try update data, return error if not
    try {
        await locals.pb.collection('surveys').update(params.id, body);
    } catch (err) {
        return error(403, 'You do not have permission to modify this resource.');
    }

    return json({
        code: 200,
    });
};

// Delete survey
export const DELETE: RequestHandler = async ({ locals, params }) => {
    // Require authenticated user
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    // Try delete survey, return error if not
    try {
        await locals.pb.collection('surveys').delete(params.id);
    } catch (err) {
        console.log(err);
        return error(403, 'You do not have permission to delete this resource.');
    }

    return json({
        code: 200,
    });
};
