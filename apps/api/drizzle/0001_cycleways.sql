CREATE TYPE "public"."cycleway_kind" AS ENUM('track', 'lane', 'shared');--> statement-breakpoint
CREATE TABLE "cycleways" (
	"osm_id" bigint PRIMARY KEY NOT NULL,
	"name" text,
	"kind" "cycleway_kind" NOT NULL,
	"surface" text,
	"geom" geometry(LineString,4326) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "osm_imports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extract_date" date NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	"cycleway_count" integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX "cycleways_geom_idx" ON "cycleways" USING gist ("geom");