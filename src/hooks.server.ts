// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
	// Handle better-auth API routes
	if (event.url.pathname.startsWith("/api/auth")) {
		return auth.handler(event.request);
	}

	// Continue with normal request handling
	return resolve(event);
};
