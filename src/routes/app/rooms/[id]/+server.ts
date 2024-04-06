import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Update room
export const PUT: RequestHandler = async ({ locals, request, params }) => {
    // require authentication
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    // parse formdata as json
    const body = await request.json();

    // try update db, return error if fail
    try {
        await locals.pb.collection('rooms').update(params.id, body);
    } catch (err) {
        console.log(err);
        return error(403, 'You do not have permission to modify this resource.');
    }

    return json({
        code: 200,
    });
};

// Delete room
export const DELETE: RequestHandler = async ({ locals, params }) => {
    // require authentication
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    // try delete in db, return error if fail
    try {
        await locals.pb.collection('rooms').delete(params.id);
    } catch (err) {
        console.log(err);
        return error(403, 'You do not have permission to delete this resource.');
    }

    return json({
        code: 200,
    });
};
