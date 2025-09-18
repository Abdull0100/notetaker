import 'dotenv/config'; // load .env into process.env
import { db } from './index';
import { users, userAuthProviders } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Starting database seed...');
  console.log('Database URL:', process.env.DATABASE_URL); // sanity check

  const email = 'admin@example.com';
  const plainPassword = 'random123';

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  let userId: string;

  if (existingUser.length > 0) {
    console.log(`User ${email} already exists, skipping user insert.`);
    userId = existingUser[0].id;
  } else {
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name: 'Admin',
        isActive: true,
      })
      .returning();
    userId = newUser.id;
    console.log(`Created user ${email} with id ${userId}`);
  }

  // Check if auth provider already exists for this user
  const existingAuth = await db
    .select()
    .from(userAuthProviders)
    .where(eq(userAuthProviders.userId, userId));

  if (existingAuth.length > 0) {
    console.log(`Auth provider for ${email} already exists, skipping provider insert.`);
  } else {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await db.insert(userAuthProviders).values({
      userId,
      provider: 'email',
      providerUserId: email,
      passwordHash,
    });
    console.log(`Created auth provider (email/password) for ${email}`);
  }

  console.log('Seed complete!');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
