DROP INDEX "cycleways_geom_idx";--> statement-breakpoint
CREATE INDEX "cycleways_geom_idx" ON "cycleways" USING gist (("geom"::geography));