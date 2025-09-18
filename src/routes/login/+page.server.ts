import { redirect, fail } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

/** @type {import('./$types').PageServerLoad} */
export async function load({ request, url }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	
	if (session?.user) {
		throw redirect(303, '/dashboard');
	}

	const registered = url.searchParams.get('registered');
	return {
		registered: registered === 'true'
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		// Validation following SvelteKit patterns
		if (!email || typeof email !== 'string') {
			return fail(400, { missing: true, email: email || '' });
		}
		
		if (!password || typeof password !== 'string') {
			return fail(400, { missing: true, email });
		}

		try {
			const result = await auth.api.signInEmail({
				body: {
					email,
					password
				}
			});

			// Check if the result indicates success and redirect
			if (result && 'user' in result) {
				throw redirect(303, '/dashboard');
			} else {
				return fail(400, { incorrect: true, email });
			}
		} catch (error) {
			console.error('Login error:', error);
			return fail(400, { incorrect: true, email });
		}
	}
};