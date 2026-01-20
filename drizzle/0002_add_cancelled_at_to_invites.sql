ALTER TABLE "contact_submissions" ADD COLUMN "subject" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invites" ADD COLUMN "cancelled_at" timestamp;