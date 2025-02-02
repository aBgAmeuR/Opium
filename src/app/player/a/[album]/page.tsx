/* eslint-disable @next/next/no-img-element */
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TrackTable } from '@/features/player/components/tracks/track-table';
import { getAlbumsWithSongs } from '@/features/player/queries';
import { formatDuration } from '@/lib/utils';

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const name = (await params).album;
  const albumWithSongs = await getAlbumsWithSongs(decodeURIComponent(name));

  if (albumWithSongs.duration === 0) {
    notFound();
  }

  const albumDetails = albumWithSongs.songs[0];

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0A0A0A] pb-[69px]">
      <div className="flex items-center justify-between bg-[#0A0A0A] p-3">
        <div className="flex items-center space-x-1">
          <Link href="/player" passHref>
            <Button variant="ghost" size="icon" className="size-7">
              <ChevronLeft className="size-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="size-7" disabled>
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-sm">{albumDetails.album}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            className="h-7 bg-[#282828] text-xs text-white hover:bg-[#3E3E3E]"
          >
            Play All
          </Button>
          <Button variant="ghost" size="icon" className="size-7">
            <Shuffle className="size-4" />
          </Button>
        </div>
      </div>

      <div className="itens-center flex justify-between">
        <div className="flex items-center space-x-3 bg-[#0A0A0A] px-4 py-3">
          <img
            src={albumDetails.imageUrl || '/placeholder.svg'}
            alt="Playlist cover"
            className="size-16 object-cover sm:size-20"
          />
          <div>
            <h1
              className="cursor-pointer text-xl font-bold sm:text-2xl"
              tabIndex={0}
            >
              {albumDetails.album}
            </h1>
            <p className="text-xs text-gray-400 sm:text-sm">
              {albumWithSongs.trackCount} tracks •{' '}
              {formatDuration(albumWithSongs.duration)}
            </p>
          </div>
        </div>
      </div>

      <ScrollArea className="mt-3 flex-1">
        <div className="min-w-max">
          {/* @ts-expect-error songs is not a PlaylistWithSongs */}
          <TrackTable playlist={{ songs: albumWithSongs.songs }} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
