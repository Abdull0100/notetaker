// src/routes/signup/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users, accounts } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { Actions, PageServerLoad } from './$types';
import { normalizeEmail, sanitizeName, sanitizePassword, isLikelyValidEmail, passwordMeetsBaselinePolicy } from '$lib/server/sanitize';

export const load: PageServerLoad = async (event) => {
	const session = await event.locals.auth();
	if (session?.user) {
		throw redirect(303, '/dashboard'); // Redirect to a protected route
	}
	return {};
};

export const actions = {
	default: async ({ request }) => {
    const data = await request.formData();
    const name = sanitizeName(data.get('name') as string);
    const email = normalizeEmail(data.get('email') as string);
    const password = sanitizePassword(data.get('password') as string);
    const confirmPassword = sanitizePassword(data.get('confirm-password') as string);

		// --- Basic Validation ---
    if (!name || !email || !password || !confirmPassword) {
			return fail(400, { message: 'All fields are required.' });
		}

    if (!isLikelyValidEmail(email)) {
      return fail(400, { message: 'Please provide a valid email address.' });
    }

    if (!passwordMeetsBaselinePolicy(password)) {
      return fail(400, { message: 'Password must be at least 8 characters.' });
    }

		if (password !== confirmPassword) {
			return fail(400, { message: 'Passwords do not match.' });
		}

		// --- Check if user already exists ---
		const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
		if (existingUser) {
			return fail(400, { message: 'An account with this email already exists.' });
		}

		// --- Hash Password and Create User ---
		try {
            const hashedPassword = await bcrypt.hash(password, 12);

			// Use a transaction to ensure both tables are updated successfully
			await db.transaction(async (tx) => {
				const [newUser] = await tx
					.insert(users)
                    .values({
                        email,
                        name
                    })
					.returning();

				// Create account record for Auth.js with password hash
				await tx.insert(accounts).values({
					userId: newUser.id,
					type: 'credentials',
					provider: 'credentials',
					providerAccountId: email, // For credentials, we can use the email as the unique provider ID
					password_hash: hashedPassword
				});
			});
		} catch (error) {
			console.error('Signup Error:', error);
			return fail(500, { message: 'Could not create user. Please try again later.' });
		}

		// Redirect to login page with a success message
		throw redirect(303, '/login?registered=true');
	}
} satisfies Actions;