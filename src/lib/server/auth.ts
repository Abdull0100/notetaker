import { SvelteKitAuth } from "@auth/sveltekit";
import { DrizzleAdapter } from "./drizzle-adapter";
import Google from "@auth/sveltekit/providers/google";
import Credentials from "@auth/sveltekit/providers/credentials";
import { db } from "./db";
import { users, userAuthProviders } from "./db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { AUTH_GOOGLE_ID,
  AUTH_SECRET,
  AUTH_GOOGLE_SECRET
 } from '$env/static/private'

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: DrizzleAdapter(),
  providers: [
    Google({
        clientId: AUTH_GOOGLE_ID,
        clientSecret: AUTH_GOOGLE_SECRET

    }),

    Credentials({
      name: 'credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'}
      },
      async authorize(credentials) {
        const creds = credentials as {email?: string, password?: string}
        if (!creds?.email || !creds?.password) return null;
        const [row] = await db
        .select()
        .from(userAuthProviders)
        .innerJoin(users, eq(users.id, userAuthProviders.userId))
        .where(eq(users.email, creds.email.toLowerCase()));

        if(!row || !row.user_auth_providers.passwordHash) return null;
        
        const hash = row.user_auth_providers.passwordHash;
        if (!hash || typeof hash !== 'string') return null;
        
        const ok = await bcrypt.compare(creds.password, hash);
        if (!ok) return null;

        return row.users;

      }
    })
  ],
    session: {strategy: 'database'},
    callbacks: {
      async session({session, user}){
        if (user) session.user.id = user.id;
        return session;
      }
    },
    secret: AUTH_SECRET,
    trustHost: true,
    debug: true
})