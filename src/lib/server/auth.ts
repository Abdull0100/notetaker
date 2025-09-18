import { SvelteKitAuth } from "@auth/sveltekit";
import { DrizzleAdapter } from "./drizzle-adapter";
import Google from "@auth/sveltekit/providers/google";
import Credentials from "@auth/sveltekit/providers/credentials";
import { db } from "./db";
import { users, accounts } from "./db/schema";
import bcrypt from "bcryptjs";
import { eq, and } from "drizzle-orm";
import { normalizeEmail, sanitizePassword } from './sanitize';

import { AUTH_GOOGLE_ID,
  AUTH_SECRET,
  AUTH_GOOGLE_SECRET
 } from '$env/static/private'

export const { handle, signIn, signOut } = SvelteKitAuth({
  adapter: DrizzleAdapter(),
  providers: [
    Google({
        clientId: AUTH_GOOGLE_ID,
        clientSecret: AUTH_GOOGLE_SECRET,
        authorization: "https://accounts.google.com/o/oauth2/v2/auth",
        token: "https://oauth2.googleapis.com/token",
        userinfo: "https://openidconnect.googleapis.com/v1/userinfo"
    }),

    Credentials({
      name: 'credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'}
      },
      async authorize(credentials) {
        console.log('[AUTH DEBUG] authorize called with credentials:', { email: credentials?.email, hasPassword: !!credentials?.password });
        
        const creds = credentials as {email?: string, password?: string}
        const email = normalizeEmail(creds?.email);
        const password = sanitizePassword(creds?.password);
        
        console.log('[AUTH DEBUG] normalized credentials:', { email, hasPassword: !!password });
        
        if (!email || !password) {
          console.log('[AUTH DEBUG] Missing email or password');
          return null;
        }
        
        console.log('[AUTH DEBUG] Querying database for user:', email);
        const [row] = await db
        .select()
        .from(accounts)
        .innerJoin(users, eq(users.id, accounts.userId))
        .where(and(eq(users.email, email), eq(accounts.provider, 'credentials')));

        console.log('[AUTH DEBUG] Database query result:', { 
          found: !!row, 
          hasPasswordHash: !!row?.accounts?.password_hash,
          userId: row?.users?.id 
        });

        if(!row || !row.accounts.password_hash) {
          console.log('[AUTH DEBUG] No user found or no password hash');
          return null;
        }
        
        const hash = row.accounts.password_hash;
        if (!hash || typeof hash !== 'string') {
          console.log('[AUTH DEBUG] Invalid password hash');
          return null;
        }
        
        console.log('[AUTH DEBUG] Comparing passwords...');
        const ok = await bcrypt.compare(password, hash);
        console.log('[AUTH DEBUG] Password comparison result:', ok);
        
        if (!ok) {
          console.log('[AUTH DEBUG] Password mismatch');
          return null;
        }

        console.log('[AUTH DEBUG] Authentication successful, returning user:', row.users.id);
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