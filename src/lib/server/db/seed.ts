// /src/lib/server/db/seed.ts

// The db instance will be passed in by drizzle-seed
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'random123';

// The script must export a default async function
export default async function seed(db: NodePgDatabase<typeof schema>) {
	console.log('🌱 Seeding database with drizzle-seed...');

	// Check if the admin user already exists
	const [existingAdmin] = await db
		.select()
		.from(schema.users)
		.where(eq(schema.users.email, ADMIN_EMAIL));

	if (existingAdmin) {
		console.log(`✅ Admin user with email "${ADMIN_EMAIL}" already exists. Skipping.`);
		return;
	}

	// If admin doesn't exist, create them
	console.log(`Creating admin user: ${ADMIN_EMAIL}`);

	const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

	try {
		await db.transaction(async (tx) => {
			const [newUser] = await tx
				.insert(schema.users)
				.values({
					email: ADMIN_EMAIL,
					name: 'Admin',
					emailVerified: new Date()
				})
				.returning();

			console.log(`   -> Created user with ID: ${newUser.id}`);

			await tx.insert(schema.userAuthProviders).values({
				userId: newUser.id,
				provider: 'credentials',
				providerUserId: ADMIN_EMAIL,
				passwordHash: hashedPassword
			});

			console.log(`   -> Created credentials provider for user.`);
		});

		console.log('🌳 Database seeded successfully!');
	} catch (error) {
		console.error('❌ An error occurred during seeding:', error);
		process.exit(1);
	}
}