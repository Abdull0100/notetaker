import { db } from '$lib/server/db';
import { users, sessions, userAuthProviders } from '$lib/server/db/schema';
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
            .from(userAuthProviders)
            .innerJoin(users, eq(userAuthProviders.userId, users.id))
            .where(
                and(
                    eq(userAuthProviders.provider, account.provider),
                    eq(userAuthProviders.providerUserId, account.providerAccountId)
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
            const [session] = await db.insert(sessions).values(data).returning();
            return session;
        },

        async getSessionAndUser(sessionToken) {
            const [session] = await db.select().from(sessions).where(eq(sessions.sessionToken, sessionToken));
            if (!session) return null;
            const [user] = await db.select().from(users).where(eq(users.id, session.userId));
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
            await db.insert(userAuthProviders).values({
                userId: data.userId,
                provider: data.provider,
                providerUserId: data.providerAccountId
            });
        },

        async unlinkAccount(data) {
            await db.delete(userAuthProviders)
            .where(and(eq(userAuthProviders.provider, data.provider),
        eq(userAuthProviders.providerUserId, data.providerAccountId)))
        },

        async createVerificationToken() {return null;},
        async useVerificationToken() {return null;}
    }
}