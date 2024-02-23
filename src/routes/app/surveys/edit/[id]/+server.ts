import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ locals, request, params }) => {
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');
    const body = await request.json();

    try {
        await locals.pb.collection('surveys').update(params.id, body);
    } catch (err) {
        return error(403, 'You do not have permission to modify this resource.');
    }

    return json({
        code: 200,
    });
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

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
