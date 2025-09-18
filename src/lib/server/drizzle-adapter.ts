import { db } from '$lib/server/db';
import { users, sessions, accounts, verificationTokens } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export function DrizzleAdapter(): import ('@auth/sveltekit/adapters').Adapter{
    return {
        //user adapter functions        
        async createUser(data) {
            const [user] = await db.insert(users).values(data).returning();
            return user;
        },

        async getUser(id) {
            const [user] = await db.select().from(users).where(eq(users.id, id));
            return user ?? null;
        },

        async getUserByEmail(email) {
            const [user] = await db.select().from(users).where(eq(users.email, email));
            return user ?? null;
        },

        async getUserByAccount(account: { provider: string; providerAccountId: string }) {
            const [row] = await db
            .select({ user: users })
            .from(accounts)
            .innerJoin(users, eq(accounts.userId, users.id))
            .where(
                and(
                    eq(accounts.provider, account.provider),
                    eq(accounts.providerAccountId, account.providerAccountId)
                )
            )
            .limit(1);

            return row ? row.user : null;
        },

        async updateUser({id, ...data}) {
            const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
            return user;
        },

        async deleteUser(id) {
            await db.delete(users).where(eq(users.id, id));
        },

        //session adapter functions

        async createSession(data) {
            console.log('[ADAPTER DEBUG] createSession called with:', data);
            const [session] = await db.insert(sessions).values(data).returning();
            console.log('[ADAPTER DEBUG] session created:', session);
            return session;
        },

        async getSessionAndUser(sessionToken) {
            console.log('[ADAPTER DEBUG] getSessionAndUser called with token:', sessionToken?.substring(0, 20) + '...');
            const [session] = await db.select().from(sessions).where(eq(sessions.sessionToken, sessionToken));
            console.log('[ADAPTER DEBUG] session found:', !!session);
            if (!session) return null;
            const [user] = await db.select().from(users).where(eq(users.id, session.userId));
            console.log('[ADAPTER DEBUG] user found:', !!user);
            if (!user) return null;
            return { session, user };
        },

        async updateSession({sessionToken, ...data}) {
            const [session] = await db.update(sessions).set(data).where(eq(sessions.sessionToken, sessionToken))
            .returning();
            return session;
        },

        async deleteSession(sessionToken) {
            await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
        },

        async linkAccount(data) {
            await db.insert(accounts).values({
                userId: data.userId,
                type: data.type,
                provider: data.provider,
                providerAccountId: data.providerAccountId,
                refresh_token: data.refresh_token,
                access_token: data.access_token,
                expires_at: data.expires_at?.toString(),
                token_type: data.token_type,
                scope: data.scope,
                id_token: data.id_token,
                session_state: data.session_state,
                password_hash: data.password_hash
            });
        },

        async unlinkAccount(data) {
            await db.delete(accounts)
            .where(and(
                eq(accounts.provider, data.provider),
                eq(accounts.providerAccountId, data.providerAccountId)
            ));
        },

        async createVerificationToken(data) {
            const [verificationToken] = await db.insert(verificationTokens).values({
                identifier: data.identifier,
                token: data.token,
                expires: data.expires
            }).returning();
            return verificationToken;
        },

        async useVerificationToken(data) {
            const [verificationToken] = await db.select().from(verificationTokens)
                .where(and(
                    eq(verificationTokens.identifier, data.identifier),
                    eq(verificationTokens.token, data.token)
                ));
            
            if (!verificationToken) return null;
            
            await db.delete(verificationTokens)
                .where(and(
                    eq(verificationTokens.identifier, data.identifier),
                    eq(verificationTokens.token, data.token)
                ));
                
            return verificationToken;
        }
    }
}