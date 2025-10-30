ALTER TABLE "album_likes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "playlist_likes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;