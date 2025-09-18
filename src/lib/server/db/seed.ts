import 'dotenv/config'; // load .env into process.env
import { db } from './index';
import { users, accounts } from './schema';
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

  // Check if account already exists for this user
  const existingAccount = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));

  if (existingAccount.length > 0) {
    console.log(`Account for ${email} already exists, skipping account insert.`);
  } else {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    await db.insert(accounts).values({
      userId,
      type: 'credentials',
      provider: 'credentials',
      providerAccountId: email,
      password_hash: passwordHash,
    });
    console.log(`Created account (credentials) for ${email}`);
  }

  console.log('Seed complete!');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
