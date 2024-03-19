import { createInstance } from '$lib/pocketbase';
import { error, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const pb = createInstance();

    // load the store data from the request cookie string
    pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');
    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
        }
    } catch (_) {
        // clear the auth store on failed refresh
        pb.authStore.clear();
        if (event.route.id?.startsWith('/app')) {
            return error(401, 'You must be logged in to complete this action.');
        }
    }

    event.locals.pb = pb;
    event.locals.user = pb.authStore.model;

    const response = await resolve(event);

    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));

    return response;
};
