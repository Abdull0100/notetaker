import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "./db/schema";
import { sendEmail } from "./email";

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
		requireEmailVerification: true, // Enable email verification
		minPasswordLength: 8,
		maxPasswordLength: 128,
	},
	// Email verification configuration
	emailVerification: {
		sendOnSignUp: true, // Automatically send verification email on signup
		autoSignInAfterVerification: true, // Auto sign-in after email verification
		sendVerificationEmail: async ({ user, url, token }, request) => {
			// Send verification email using our email service
			await sendEmail({
				to: user.email,
				subject: "Verify your email address",
				html: `
					<!DOCTYPE html>
					<html>
					<head>
						<meta charset="utf-8">
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<title>Verify your email</title>
					</head>
					<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
						<div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
							<h1 style="color: #007cba; margin-bottom: 30px;">Verify your email address</h1>
							<p style="font-size: 16px; margin-bottom: 30px;">Hi ${user.name || 'there'},</p>
							<p style="font-size: 16px; margin-bottom: 30px;">
								Thanks for signing up! Please click the button below to verify your email address and activate your account.
							</p>
							<a href="${url}" style="background: #007cba; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block; margin-bottom: 30px;">
								Verify Email Address
							</a>
							<p style="font-size: 14px; color: #666; margin-bottom: 20px;">
								If the button doesn't work, copy and paste this URL into your browser:
							</p>
							<p style="font-size: 14px; word-break: break-all; background: #f1f1f1; padding: 10px; border-radius: 5px; margin-bottom: 30px;">
								${url}
							</p>
							<p style="font-size: 14px; color: #666;">
								This link will expire in 24 hours for security reasons.
							</p>
							<hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
							<p style="font-size: 12px; color: #999;">
								If you didn't create an account, you can safely ignore this email.
							</p>
						</div>
					</body>
					</html>
				`,
				text: `Hi ${user.name || 'there'},

Thanks for signing up! Please verify your email address by clicking this link:

${url}

If the link doesn't work, copy and paste it into your browser.

This link will expire in 24 hours for security reasons.

If you didn't create an account, you can safely ignore this email.`
			});

			console.log(`✅ Verification email sent to ${user.email}`);
		},
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