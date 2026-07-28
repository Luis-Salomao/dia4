CREATE TABLE "students" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"campus" text NOT NULL,
	"course" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
