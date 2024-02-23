import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, request }) => {
    const data = await request.json();

    try {
        await locals.pb.collection('answers').create({
            name: data.name,
            answers: data.answers,
            room: data.room,
            survey: data.survey,
        });
    } catch (err) {
        return error(500, 'Something went wrong, please try again.');
    }

    return json({
        code: 200,
    });
};
