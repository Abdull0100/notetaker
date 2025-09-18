// src/routes/+layout.server.ts
import { auth } from "$lib/server/auth";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ request }) {
	const session = await auth.api.getSession({
		headers: request.headers
	});
	
	return {
		session
	};
}