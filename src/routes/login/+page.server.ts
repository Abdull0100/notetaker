import { redirect } from '@sveltejs/kit';
import { signIn } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	// CORRECTED: Use event.locals.auth()
	const session = await event.locals.auth();
	if (session?.user) {
		throw redirect(303, '/dashboard');
	}

	const url = new URL(event.request.url);
	const registered = url.searchParams.get('registered');
	return {
		registered: registered === 'true'
	};
};


export const actions = {
    default: signIn
} satisfies Actions