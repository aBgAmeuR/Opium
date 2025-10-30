CREATE TABLE "album_likes" (
	"user_id" text NOT NULL,
	"album_id" integer NOT NULL,
	CONSTRAINT "album_likes_user_id_album_id_pk" PRIMARY KEY("user_id","album_id")
);
--> statement-breakpoint
CREATE TABLE "playlist_likes" (
	"user_id" text NOT NULL,
	"playlist_id" integer NOT NULL,
	CONSTRAINT "playlist_likes_user_id_playlist_id_pk" PRIMARY KEY("user_id","playlist_id")
);
--> statement-breakpoint
ALTER TABLE "album_likes" ADD CONSTRAINT "album_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "album_likes" ADD CONSTRAINT "album_likes_album_id_album_id_fk" FOREIGN KEY ("album_id") REFERENCES "public"."album"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_likes" ADD CONSTRAINT "playlist_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playlist_likes" ADD CONSTRAINT "playlist_likes_playlist_id_playlist_id_fk" FOREIGN KEY ("playlist_id") REFERENCES "public"."playlist"("id") ON DELETE cascade ON UPDATE no action;