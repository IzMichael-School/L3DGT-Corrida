import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const surveys = await locals.pb.collection('surveys').getFullList(200, {
        filter: `owner.id = "${locals.user?.id}"`,
        sort: '-updated',
    });
    return { surveys };
};
