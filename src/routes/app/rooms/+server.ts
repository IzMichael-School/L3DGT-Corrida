import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('ABCDEFGHIJKLMNPQRTUVWXY346789', 7);

export const GET: RequestHandler = async ({ locals }) => {
    const rooms = await locals.pb.collection('rooms').getFullList(200, {
        filter: `owner.id = "${locals.user?.id}"`,
    });
    return json({ rooms });
};

export const POST: RequestHandler = async ({ locals }) => {
    if (!locals.user?.id) return error(401, 'You must be logged in to complete this action.');

    const room = await locals.pb.collection('rooms').create({
        title: 'Untitled Room',
        code: nanoid(),
        status: 'waiting',
        owner: locals.user.id,
    });
    return json(room);
};
