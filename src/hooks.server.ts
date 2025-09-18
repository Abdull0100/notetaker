// src/hooks.server.ts
import { auth } from "$lib/server/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith("/api/auth")) {
		return auth.handler(event.request);
	}
	
	return resolve(event);
};
