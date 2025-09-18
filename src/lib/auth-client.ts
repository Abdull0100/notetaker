import { createAuthClient } from "better-auth/svelte";

// Create the auth client - should match server baseURL
export const authClient = createAuthClient({
	baseURL: process.env.NODE_ENV === 'production' 
		? process.env.BETTER_AUTH_URL || "https://yourdomain.com"
		: "http://localhost:5173"
});

// Export direct client functions for easier usage (latest pattern)
export const { signIn, signOut, signUp, useSession } = authClient;

// Helper functions for common auth operations (backward compatibility)
export const authHelpers = {
	// Sign in with email and password
	async signInWithPassword(email: string, password: string) {
		return await signIn.email({
			email,
			password,
		});
	},

	// Sign up with email and password
	async signUpWithPassword(email: string, password: string, name: string = "") {
		return await signUp.email({
			email,
			password,
			name,
		});
	},

	// Sign in with Google
	async signInWithGoogle() {
		return await signIn.social({
			provider: "google",
		});
	},

	// Sign out
	async logout() {
		return await signOut();
	},

	// Get current session (client-side)
	getSession() {
		return authClient.getSession();
	},

	// Get reactive session for Svelte components
	useSession() {
		return authClient.useSession();
	},
};
