import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			user: schema.user,
			session: schema.session,
			account: schema.account,
			verification: schema.verification,
		},
	}),
	// Enable social providers if environment variables are available
	socialProviders: {
		...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			},
		}),
	},
	// Email and password authentication
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false, // Set to false for easier testing
		minPasswordLength: 8,
		maxPasswordLength: 128,
	},
	// Database session configuration (no JWT)
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5, // 5 minutes
		},
	},
	// Security settings
	rateLimit: {
		enabled: true,
		window: 60 * 1000, // 1 minute
		max: 100, // 100 requests per minute
	},
	// Advanced configuration
	advanced: {
		database: {
			generateId: () => crypto.randomUUID(),
		},
		crossSubDomainCookies: {
			enabled: false,
		},
	},
	// Base URL for production
	baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5173",
	// Secret for signing cookies and tokens
	secret: process.env.BETTER_AUTH_SECRET || "your-secret-key-change-in-production",
});

// Export types for TypeScript
export type Session = typeof auth.$Infer.Session;