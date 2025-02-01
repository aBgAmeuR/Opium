import type * as Prisma from '@prisma/client';

export type Song = Prisma.Song;
export type NewSong = Prisma.Song;
export type Playlist = Prisma.Playlist;
export type NewPlaylist = Prisma.Playlist;
export type PlaylistSong = Prisma.PlaylistSong;
export type NewPlaylistSong = Prisma.PlaylistSong;
export type PlaylistWithSongs = Playlist & {
  songs: (Song & { order: number })[];
  trackCount: number;
  duration: number;
};
