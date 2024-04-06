import type { PageServerLoad } from './$types';

// On page load
export const load: PageServerLoad = async ({ locals }) => {
    // return list of surveys
    const surveys = await locals.pb.collection('surveys').getFullList(200, {
        filter: `owner.id = "${locals.user?.id}"`,
        sort: '-updated',
    });
    return { surveys };
};
