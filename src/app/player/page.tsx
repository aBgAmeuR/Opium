import { Suspense } from 'react';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { TrackTable } from '@/features/player/components/tracks/track-table';
import { getAllSongs, searchSongs } from '@/features/player/queries';

async function Tracks({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const query = (await searchParams).q;
  const songs = query ? await searchSongs(query) : await getAllSongs();
  // @ts-expect-error songs is not a PlaylistWithSongs
  return <TrackTable query={query} playlist={{ songs }} />;
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0A0A0A] pb-[69px] pt-2">
      <ScrollArea className="flex-1">
        <div className="min-w-max">
          <Suspense fallback={<div className="w-full" />}>
            <Tracks searchParams={searchParams} />
          </Suspense>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
