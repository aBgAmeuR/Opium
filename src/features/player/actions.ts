'use server';

import { ObjectId } from 'bson';
import * as mm from 'music-metadata';
import { revalidatePath } from 'next/cache';

import { cloudinary } from '@/lib/cloudinary';
import { db } from '@/lib/prisma';

export async function createPlaylistAction(id: string, name: string) {
  if (process.env.VERCEL_ENV === 'production') {
    return;
  }

  await db.playlist.create({
    data: { id, name },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadPlaylistCoverAction(_: any, formData: FormData) {
  if (process.env.VERCEL_ENV === 'production') {
    return;
  }

  const playlistId = formData.get('playlistId') as string;
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('No file provided');
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const coverData = `data:${file.type};base64,${buffer.toString('base64')}`;
    const coverUpload = await cloudinary.v2.uploader.upload(coverData, {
      folder: 'song-covers',
      public_id: new ObjectId().toString(),
    });

    console.log('coverUpload', coverUpload);

    await db.playlist.update({
      where: { id: playlistId },
      data: { coverUrl: coverUpload.secure_url },
    });

    revalidatePath(`/player/p/${playlistId}`);

    return { success: true, coverUrl: coverUpload.secure_url };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function updatePlaylistNameAction(
  playlistId: string,
  name: string
) {
  if (process.env.VERCEL_ENV === 'production') {
    return;
  }

  await db.playlist.update({
    where: { id: playlistId },
    data: { name },
  });

  revalidatePath('/player', 'layout');
}

export async function deletePlaylistAction(id: string) {
  if (process.env.VERCEL_ENV === 'production') {
    return;
  }

  await db.playlistSong.deleteMany({ where: { playlistId: id } });
  const playlist = await db.playlist.delete({ where: { id } });

  if (playlist.coverUrl) {
    const publicId = playlist.coverUrl.split('/').pop();
    await cloudinary.v2.uploader.destroy(publicId!);
  }

  revalidatePath('/player', 'layout');
}

export async function addToPlaylistAction(playlistId: string, songId: string) {
  const existingEntry = await db.playlistSong.findFirst({
    where: { playlistId, songId },
  });

  if (existingEntry) {
    return { success: false, message: 'Song is already in the playlist' };
  }

  const maxOrder = await db.playlistSong.aggregate({
    where: { playlistId },
    _max: { order: true },
  });

  const newOrder = (maxOrder._max.order ?? 0) + 1;

  await db.playlistSong.create({
    data: { playlistId, songId, order: newOrder },
  });

  revalidatePath('/player', 'layout');

  return { success: true, message: 'Song added to playlist successfully' };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTrackAction(_: any, formData: FormData) {
  const trackId = formData.get('trackId') as string;
  const field = formData.get('field') as string;
  const value = formData.get(field);

  // if (field === 'bpm' && typeof value === 'string') {
  //   value = parseInt(value);
  //   if (isNaN(value)) {
  //     return { success: false, error: 'bpm should be a valid number' };
  //   }
  // }

  await db.song.update({
    where: { id: trackId },
    data: { [field]: value },
  });

  revalidatePath('/player', 'layout');

  return { success: true, error: '' };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateTrackImageAction(_: any, formData: FormData) {
  const trackId = formData.get('trackId') as string;
  const file = formData.get('file') as File;

  if (!trackId || !file) {
    throw new Error('Missing trackId or file');
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const coverData = `data:${file.type};base64,${buffer.toString('base64')}`;
    const coverUpload = await cloudinary.v2.uploader.upload(coverData, {
      folder: 'song-covers',
      public_id: new ObjectId().toString(),
    });

    await db.song.update({
      where: { id: trackId },
      data: { imageUrl: coverUpload.secure_url },
    });

    revalidatePath('/player', 'layout');

    return { success: true, imageUrl: coverUpload.secure_url };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function addSongAction(
  formData: FormData,
  overideAlbum: string | null,
  type: string,
  defaultCoverUrl?: string
) {
  if (process.env.VERCEL_ENV === 'production') {
    return;
  }

  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  try {
    // Read the metadata from the file
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await mm.parseBuffer(buffer, file.type);

    if (!metadata.common.title || !metadata.common.artist) {
      return { success: false, error: 'Metadata missing (title/artist)' };
    }

    // Upload cover to Cloudinary if available
    let coverUrl = defaultCoverUrl;
    if (
      metadata.common.picture &&
      metadata.common.picture.length > 0 &&
      !defaultCoverUrl
    ) {
      const cover = metadata.common.picture[0];
      const coverData = `data:${cover.format};base64,${Buffer.from(
        cover.data
      ).toString('base64')}`;

      try {
        const coverUpload = await cloudinary.v2.uploader.upload(coverData, {
          folder: 'song-covers',
          public_id: new ObjectId().toString(),
        });
        coverUrl = coverUpload.secure_url;
      } catch (coverError) {
        console.error('Error uploading cover:', coverError);
        return { success: false, error: 'Failed to upload cover image' };
      }
    }

    // Upload audio file to Cloudinary
    const uploadPromise = new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'video', // "video" for audio
          folder: 'songs',
          public_id: new ObjectId().toString(),
        },
        (error, result) => {
          if (error) {
            reject(new Error('Cloudinary upload failed'));
          } else {
            resolve(result!.secure_url); // result is defined if no error
          }
        }
      );

      uploadStream.end(buffer);
    });

    const audioUrl = await uploadPromise;

    // Save the song to the database
    await db.song.create({
      data: {
        name: metadata.common.title,
        artist: metadata.common.artist,
        album: overideAlbum || metadata.common.album || null,
        duration: metadata.format.duration
          ? Math.round(metadata.format.duration)
          : 0,
        type: type,
        genre: metadata.common.genre ? metadata.common.genre[0] : null,
        bpm: metadata.common.bpm ? Number(metadata.common.bpm) : null,
        key: metadata.common.key || null,
        imageUrl: coverUrl,
        audioUrl: audioUrl,
        isLocal: false,
      },
    });

    return {
      success: true,
      message: 'Song added successfully!',
      coverUrl: coverUrl,
    };
  } catch (error) {
    console.error('Error processing file:', error);
    return { success: false, error: 'Failed to process file' };
  }
}

export async function deleteSongAction(id: string) {
  if (process.env.VERCEL_ENV === 'production') {
    return;
  }

  await db.playlistSong.deleteMany({ where: { songId: id } });
  await db.song.delete({ where: { id } });

  revalidatePath('/player', 'layout');
}
