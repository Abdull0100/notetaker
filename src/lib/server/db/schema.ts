import { time } from 'console';
import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	email: text('email').notNull().unique(),
	name: text('name'),
	createdAt: timestamp('created_at').defaultNow()
});

export const meetings = pgTable('meetings', {
	id: uuid('id').defaultRandom().primaryKey(),
	title: text('title'),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time'),
	createdAt: timestamp('created_at').defaultNow(),
	userId: uuid('user_id')
	.notNull()
	.references(() => users.id, {onDelete: 'cascade'})
})

export const integrations = pgTable('integrations', {
	id: uuid('id').defaultRandom().primaryKey(),
	provider: text('provider').notNull(),
	apiKeys: jsonb('api_keys').$type<Record<string, any>>(),
	createdAt: timestamp('created_at').defaultNow(),
	userId: uuid('user_id')
	.notNull()
	.references(() => users.id, {onDelete: 'cascade'})
})

export const transcripts = pgTable('transcripts', {
	id: uuid('id').defaultRandom().primaryKey(),
	content: text('content').notNull(),
	segments: jsonb('segments').$type<
	{start: number; end: number; speaker: string; text: string}[]
	>(),
	createdAt: timestamp('created_at').defaultNow(),
	meetingId: uuid('meeting_id')
	.notNull()
	.references(() => meetings.id, {onDelete: 'cascade'})
})

export const summaries = pgTable('summaries', {
	id: uuid('id').defaultRandom().primaryKey(),
	content: text('content').notNull(),
	actionItems: jsonb('action_items').$type<
	{task: string; assignee?: string; due_date?: string}[]
	>(),
	createdAt: timestamp("created_at").defaultNow(),
	meetingId: uuid('meeting_id')
	.notNull()
	.references(() => meetings.id, {onDelete: 'cascade'})
})

export const seeds = pgTable('seeds', {
	id: uuid('id').defaultRandom().primaryKey(),
	meetingId: uuid('meeting_id')
	.notNull()
	.references(() => meetings.id, {onDelete: 'cascade'}),
	type: text('type').notNull(), //types: transcript | summary
	hash: text('hash').notNull(),
	blockchainTxId: text('blockchain_tx_id'),
	createdAt: timestamp('created_at').defaultNow()
})