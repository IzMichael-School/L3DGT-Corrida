import { createInstance } from '$lib/pocketbase';
import { error, type Handle } from '@sveltejs/kit';

// Runs whenever page navigation takes place
export const handle: Handle = async ({ event, resolve }) => {
    // Create a database link instance
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

        // error if user is not authenticated
        if (event.route.id?.startsWith('/app')) {
            return error(401, 'You must be logged in to complete this action.');
        }
    }

    // Pass database connection and current user to request local variables
    event.locals.pb = pb;
    event.locals.user = pb.authStore.model;

    // Resolve the original page navigation
    const response = await resolve(event);

    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.set('set-cookie', pb.authStore.exportToCookie({ httpOnly: false }));

    return response;
};
