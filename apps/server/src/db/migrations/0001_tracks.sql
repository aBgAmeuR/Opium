CREATE TABLE IF NOT EXISTS `tracks` (
  `id` text PRIMARY KEY NOT NULL,
  `title` text NOT NULL,
  `artists_csv` text NOT NULL,
  `album` text,
  `cover_url` text,
  `cover_from_track_id` text,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE IF NOT EXISTS `track_versions` (
  `id` text PRIMARY KEY NOT NULL,
  `track_id` text NOT NULL,
  `type` text NOT NULL,
  `title` text,
  `order_index` integer NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL,
  FOREIGN KEY (`track_id`) REFERENCES `tracks`(`id`) ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE INDEX IF NOT EXISTS `tracks_title_idx` ON `tracks` (`title`);
CREATE INDEX IF NOT EXISTS `tracks_created_idx` ON `tracks` (`created_at`);
CREATE INDEX IF NOT EXISTS `versions_track_idx` ON `track_versions` (`track_id`);


