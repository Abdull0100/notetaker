import { pgTable, uuid, text, timestamp, numeric, boolean } from 'drizzle-orm/pg-core';

//users table
export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name'),
	isActive: boolean('is_active').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//user auth providers table
//references users table as foreign key
export const userAuthProviders = pgTable('user_auth_providers', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	provider: text('provider').notNull(), // google, email, etc.
	providerUserId: text('provider_user_id').notNull(),
	passwordHash: text('password_hash'), // optional for email/password
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//meetings table, references users table as foreign key
export const meetings = pgTable('meetings', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title').default('Untitled Meeting'),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
	ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' })
});

//table to track meeting participants for a specific meeting
//references meetings and users table as foreign keys
//divides user into organzier and participant
export const meetingParticipants = pgTable('meeting_participants', {
	id: uuid('id').defaultRandom().primaryKey(),
	meetingId: uuid('meeting_id').notNull().references(() => meetings.id, { onDelete: 'cascade' }),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	role: text('role').default('participant'),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//table to track our integrations, focus is Google Meet
//will expand as integrations are added
//references user table as foreign key
export const integrations = pgTable('integrations', {
	id: uuid('id').defaultRandom().primaryKey(),
	provider: text('provider').notNull(), // google, zoom, teams, etc.
	scope: text('scope'), // optional permissions
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' })
});

//table to securely store API keys for the user (different from .env client secrets)
//useful for tracking keys for the user, must be encrypted before storing here
//references integrations table as foreign key
export const integrationKeys = pgTable('integration_keys', {
	id: uuid('id').defaultRandom().primaryKey(),
	integrationId: uuid('integration_id').notNull().references(() => integrations.id, { onDelete: 'cascade' }),
	keyName: text('key_name').notNull(),   // e.g., "apiKey", "clientSecret", "refreshToken"
	keyValue: text('key_value').notNull(), // hashed/encrypted value
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
	expiresAt: timestamp('expires_at')     // optional
});

//table to track meeting integrations
//useful for specific meeting IDs for a specific API (Google, Zoom etc.)
//references meetings and integrations table as a foreign key
export const meetingIntegrations = pgTable('meeting_integrations', {
	id: uuid('id').defaultRandom().primaryKey(),
	meetingId: uuid('meeting_id').notNull().references(() => meetings.id, { onDelete: 'cascade' }),
	integrationId: uuid('integration_id').notNull().references(() => integrations.id, { onDelete: 'cascade' }),
	externalMeetingId: text('external_meeting_id').notNull(), // Google Meet ID, Zoom ID, Teams ID
	joinUrl: text('join_url'), // optional
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//table to track whatever features we will integrate into the service
//useful for tracking whatever we have actually implemented
//TBD as to how useful it will be in the final build
export const integrationFeatures = pgTable('integration_features', {
	id: uuid('id').defaultRandom().primaryKey(),
	integrationId: uuid('integration_id').notNull().references(() => integrations.id, { onDelete: 'cascade' }),
	featureName: text('feature_name').notNull(), // e.g., transcription, recording
	enabled: boolean('enabled').default(true),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//database table to store transcripts
//stores in text, references meetings table as foreign key
export const transcripts = pgTable('transcripts', {
	id: uuid('id').defaultRandom().primaryKey(),
	content: text('content').notNull(), // full transcript text
	language: text('language').default('en'),
	source: text('source'), // Whisper, Vexa, etc.
	meetingId: uuid('meeting_id').notNull().references(() => meetings.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//these are basically chunks of data stored for the real-time transcription through Vexa
//references transcripts table as foreign key
export const transcriptSegments = pgTable('transcript_segments', {
	id: uuid('id').defaultRandom().primaryKey(),
	transcriptId: uuid('transcript_id').notNull().references(() => transcripts.id, { onDelete: 'cascade' }),
	start: numeric('start').notNull(), // seconds
	end: numeric('end').notNull(),
	speaker: text('speaker').notNull(),
	text: text('text').notNull(),
	confidence: numeric('confidence'), // optional ASR confidence
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//table to store summaries, TBD as to how we will preserve context for the user
//references meetings table as a foreign key
export const summaries = pgTable('summaries', {
	id: uuid('id').defaultRandom().primaryKey(),
	content: text('content').notNull(), // full summary text
	summaryType: text('summary_type').default('general'), // bullet, executive, RAG
	meetingId: uuid('meeting_id').notNull().references(() => meetings.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//preserving action items from the generated summary
//this is an important feature for integration with PM tools like Linear
//refernces summaries and users table as foreign key
export const summaryActionItems = pgTable('summary_action_items', {
	id: uuid('id').defaultRandom().primaryKey(),
	summaryId: uuid('summary_id').notNull().references(() => summaries.id, { onDelete: 'cascade' }),
	task: text('task').notNull(),
	assigneeId: uuid('assignee_id').references(() => users.id),
	dueDate: timestamp('due_date'),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

//storing the hashes for the seeds on the blockchain
//references meeting as a foreign key
export const seeds = pgTable('seeds', {
	id: uuid('id').defaultRandom().primaryKey(),
	meetingId: uuid('meeting_id').notNull().references(() => meetings.id, { onDelete: 'cascade' }),
	type: text('type').notNull(), // transcript | summary
	hash: text('hash').notNull(),
	algorithm: text('algorithm').default('SHA256'),
	blockchainTxId: text('blockchain_tx_id'),
	status: text('status').default('pending'), // pending, confirmed, failed
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});
