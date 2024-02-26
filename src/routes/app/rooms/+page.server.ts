import type { RoomsResponse } from '$lib/pocketbase-types';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const rooms = await locals.pb.collection('rooms').getFullList<RoomsResponse>(200, {
        filter: `owner.id = "${locals.user?.id}"`,
        sort: '-updated',
    });
    return { rooms };
};
