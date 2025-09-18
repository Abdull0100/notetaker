// src/routes/signup/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

/** @type {import('./$types').PageServerLoad} */
export async function load({ request }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	
	if (session?.user) {
		throw redirect(303, '/dashboard');
	}
	return {};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;

		// Basic validation
		if (!name || !email || !password || !confirmPassword) {
			return fail(400, { message: 'All fields are required.' });
		}

		if (password.length < 8) {
			return fail(400, { message: 'Password must be at least 8 characters.' });
		}

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match.' });
		}

		try {
			const result = await auth.api.signUpEmail({
				body: {
					name,
					email,
					password
				}
			});

			// Check if the result indicates success and redirect
			if (result && 'user' in result) {
				throw redirect(303, '/login?registered=true');
			} else {
				return fail(400, { message: 'Signup failed' });
			}
		} catch (error) {
			console.error('Signup error:', error);
			return fail(500, { message: 'An error occurred during signup' });
		}
	}
};