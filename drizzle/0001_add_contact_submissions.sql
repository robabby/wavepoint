CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"ip_address" text NOT NULL,
	"brevo_contact_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "contact_submissions_email_idx" ON "contact_submissions" USING btree ("email");
--> statement-breakpoint
CREATE INDEX "contact_submissions_ip_address_created_at_idx" ON "contact_submissions" USING btree ("ip_address","created_at");
