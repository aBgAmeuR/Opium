import { db } from '@/lib/prisma';

export const getAllSongs = async () => {
  return db.song.findMany({
    orderBy: { name: 'asc' },
  });
};

export const getSongById = async (id: string) => {
  return db.song.findUnique({
    where: { id },
  });
};

export const getAllPlaylists = async () => {
  return db.playlist.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getPlaylistWithSongs = async (id: string) => {
  const result = await db.playlist.findUnique({
    where: { id },
    include: {
      playlistSongs: {
        include: {
          song: true,
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!result) return null;

  const songs = result.playlistSongs.map((ps) => ({
    ...ps.song,
    order: ps.order,
  }));

  const trackCount = songs.length;
  const duration = songs.reduce((total, song) => total + song.duration, 0);

  return { ...result, songs, trackCount, duration };
};

export const addSongToPlaylist = async (
  playlistId: string,
  songId: string,
  order: number
) => {
  return db.playlistSong.create({
    data: { playlistId, songId, order },
  });
};

export const removeSongFromPlaylist = async (
  playlistId: string,
  songId: string
) => {
  return db.playlistSong.delete({
    where: { playlistId_songId: { playlistId, songId } },
  });
};

export const createPlaylist = async (
  id: string,
  name: string,
  coverUrl?: string
) => {
  return db.playlist.create({
    data: { id, name, coverUrl },
  });
};

export const updatePlaylist = async (
  id: string,
  name: string,
  coverUrl?: string
) => {
  return db.playlist.update({
    where: { id },
    data: { name, coverUrl, updatedAt: new Date() },
  });
};

export const deletePlaylist = async (id: string) => {
  await db.playlistSong.deleteMany({ where: { playlistId: id } });
  return db.playlist.delete({ where: { id } });
};

export const searchSongs = async (searchTerm: string) => {
  return db.song.findMany({
    where: {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { artist: { contains: searchTerm, mode: 'insensitive' } },
        { album: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    orderBy: { name: 'asc' },
    take: 50,
  });
};

export const getRecentlyAddedSongs = async (limit: number = 10) => {
  return db.song.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
};

// avoir l'id de la playlist qui a ete créée juste avant la playlist actuelle
export const getNextPlaylistId = async (createdAt: Date) => {
  const result = await db.playlist.findMany({
    where: { createdAt: { lt: createdAt } },
    orderBy: { createdAt: 'desc' },
    take: 1,
  });
  if (result.length) return result[0].id;
  return null;
};
