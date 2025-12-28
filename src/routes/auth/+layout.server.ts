import { redirect } from '@sveltejs/kit'

export const load = ({ locals }) => {
    if(locals.user?.id) {
        throw redirect(302, '/')
    }
}