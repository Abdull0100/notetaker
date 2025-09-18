import { createAuthClient } from "better-auth/svelte";

// Create the auth client - should match server baseURL
export const authClient = createAuthClient({
	baseURL: "http://localhost:5173", // Update this for production
});

// Helper functions for common auth operations
export const authHelpers = {
	// Sign in with email and password
	async signInWithPassword(email: string, password: string) {
		return await authClient.signIn.email({
			email,
			password,
		});
	},

	// Sign up with email and password
	async signUpWithPassword(email: string, password: string, name: string = "") {
		return await authClient.signUp.email({
			email,
			password,
			name,
		});
	},

	// Sign in with Google
	async signInWithGoogle() {
		return await authClient.signIn.social({
			provider: "google",
		});
	},

	// Sign out
	async logout() {
		return await authClient.signOut();
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
