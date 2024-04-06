import type { RoomsResponse } from '$lib/pocketbase-types';
import type { PageServerLoad } from './$types';

// Get room list from db
export const load: PageServerLoad = async ({ locals }) => {
    const rooms = await locals.pb.collection('rooms').getFullList<RoomsResponse>(200, {
        filter: `owner.id = "${locals.user?.id}"`,
        sort: '-updated',
    });
    return { rooms };
};
