import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CoverImage } from '@/features/player/components/tracks/cover-image';
import { EditableTitle } from '@/features/player/components/tracks/editable-title';
import { TrackTable } from '@/features/player/components/tracks/track-table';
import {
  getNextPlaylistId,
  getPlaylistWithSongs,
} from '@/features/player/queries';
import { formatDuration } from '@/lib/utils';

export default async function PlaylistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const playlist = await getPlaylistWithSongs(id);

  if (!playlist) {
    notFound();
  }

  const nextPlaylistId = await getNextPlaylistId(playlist.createdAt);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-[#0A0A0A] pb-[69px]">
      <div className="flex items-center justify-between bg-[#0A0A0A] p-3">
        <div className="flex items-center space-x-1">
          <Link href="/player" passHref>
            <Button variant="ghost" size="icon" className="size-7">
              <ChevronLeft className="size-4" />
            </Button>
          </Link>
          {nextPlaylistId ? (
            <Link href={`/player/p/${nextPlaylistId}`} passHref>
              <Button variant="ghost" size="icon" className="size-7">
                <ChevronRight className="size-4" />
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" size="icon" className="size-7" disabled>
              <ChevronRight className="size-4" />
            </Button>
          )}
          <span className="text-sm">{playlist.name}</span>
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

      <div className="flex items-center space-x-3 bg-[#0A0A0A] px-4 py-3">
        <CoverImage url={playlist.coverUrl} playlistId={playlist.id} />
        <div>
          <EditableTitle playlistId={playlist.id} initialName={playlist.name} />
          <p className="text-xs text-gray-400 sm:text-sm">
            {playlist.trackCount} tracks • {formatDuration(playlist.duration)}
          </p>
        </div>
      </div>

      <ScrollArea className="mt-3 flex-1">
        <div className="min-w-max">
          <TrackTable playlist={playlist} />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
