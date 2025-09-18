import { auth } from "./auth";
import type { RequestEvent } from "@sveltejs/kit";

/**
 * Get the current session from a SvelteKit request event
 * Based on official better-auth documentation pattern
 */
export async function getSessionFromEvent(event: RequestEvent) {
	try {
		const session = await auth.api.getSession({
			headers: event.request.headers,
		});
		return session;
	} catch (error) {
		console.error("Error getting session:", error);
		return null;
	}
}

/**
 * Require authentication for a route
 * Throws an error if user is not authenticated
 */
export async function requireAuth(event: RequestEvent) {
	const session = await getSessionFromEvent(event);
	
	if (!session) {
		throw new Error("Authentication required");
	}
	
	return session;
}

/**
 * Get user from session
 */
export async function getUserFromEvent(event: RequestEvent) {
	const session = await getSessionFromEvent(event);
	return session?.user || null;
}
