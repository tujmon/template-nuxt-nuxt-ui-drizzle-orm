CREATE TABLE "scheduler_task" (
	"name" text PRIMARY KEY NOT NULL,
	"locked_at" timestamp,
	"last_run_at" timestamp,
	"last_duration_ms" integer,
	"last_status" text,
	"last_error" text
);
