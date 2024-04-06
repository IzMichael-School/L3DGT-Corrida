import { pb } from '$lib/pocketbase';
import { currentUser } from '$lib/pocketbase';

// load the store data from the request cookie string
pb.authStore.loadFromCookie(document.cookie);
// When auth store changes,
pb.authStore.onChange(() => {
    // set current user store to auth store
    currentUser.set(pb.authStore.model);
    // store auth store in cookies
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
}, true);
