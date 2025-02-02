'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpAZ,
  ArrowUpZA,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Trash,
} from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { env } from '@/env.mjs';
import {
  addToPlaylistAction,
  deleteSongAction,
} from '@/features/player/actions';
import { usePlayback } from '@/features/player/components/playback/playback-context';
import { usePlaylist } from '@/features/player/hooks/use-playlist';
import { PlaylistWithSongs, Song } from '@/features/player/types';
import { cn, formatDuration, highlightText } from '@/lib/utils';

const isDevelopment = env.NEXT_PUBLIC_DEVELOPMENT;

function TrackRow({
  track,
  index,
  query,
  isSelected,
  onSelect,
}: {
  track: Song;
  index: number;
  query?: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const {
    currentTrack,
    playTrack,
    togglePlayPause,
    isPlaying,
    setActivePanel,
    handleKeyNavigation,
  } = usePlayback();
  const { playlists } = usePlaylist();

  const [isFocused, setIsFocused] = useState(false);
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
  const isCurrentTrack = currentTrack?.name === track.name;

  function onClickTrackRow(e: React.MouseEvent) {
    e.preventDefault();
    setActivePanel('tracklist');
    onSelect();
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playTrack(track);
    }
  }

  function onKeyDownTrackRow(e: React.KeyboardEvent<HTMLTableRowElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
      if (isCurrentTrack) {
        togglePlayPause();
      } else {
        playTrack(track);
      }
    } else {
      handleKeyNavigation(e, 'tracklist');
    }
  }

  return (
    <tr
      className={`group relative cursor-pointer select-none hover:bg-[#1A1A1A] ${
        isCurrentTrack ? 'bg-[#1A1A1A]' : ''
      }`}
      tabIndex={0}
      onClick={onClickTrackRow}
      onKeyDown={onKeyDownTrackRow}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <td className="w-10 py-[2px] pl-3 pr-2 text-center tabular-nums">
        {isCurrentTrack && isPlaying ? (
          <div className="mx-auto flex size-[0.65rem] items-end justify-center space-x-[2px]">
            <div className="animate-now-playing-1 w-1 bg-neutral-600"></div>
            <div className="animate-now-playing-2 w-1 bg-neutral-600 [animation-delay:0.2s]"></div>
            <div className="animate-now-playing-3 w-1 bg-neutral-600 [animation-delay:0.4s]"></div>
          </div>
        ) : (
          <span className="text-gray-400">{index + 1}</span>
        )}
      </td>
      <td className="px-2 py-[2px]">
        <div className="flex items-center">
          <div className="relative mr-2 size-5">
            <Image
              src={track.imageUrl || '/placeholder.svg'}
              alt={`${track.album} cover`}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="max-w-[180px] truncate font-medium text-[#d1d5db] sm:max-w-[200px]">
            {highlightText(track.name, query)}
            <span className="ml-1 text-gray-400 sm:hidden">
              • {highlightText(track.album!, query)}
            </span>
          </div>
        </div>
      </td>
      <td className="hidden max-w-40 truncate px-2 py-[2px] text-[#d1d5db] sm:table-cell">
        {highlightText(track.artist, query)}
      </td>
      <td className="hidden px-2 py-[2px] text-[#d1d5db] md:table-cell">
        {highlightText(track.album!, query)}
      </td>
      <td className="hidden px-2 py-[2px] text-[#d1d5db] md:table-cell">
        {highlightText(track.type, query)}
      </td>
      <td className="px-2 py-[2px] tabular-nums text-[#d1d5db]">
        {formatDuration(track.duration)}
      </td>
      <td className="px-2 py-[2px]">
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                disabled={isProduction}
                variant="ghost"
                size="icon"
                className="size-5 text-gray-400 hover:text-white focus:text-white"
              >
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Track options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isCurrentTrack) {
                    togglePlayPause();
                  } else {
                    playTrack(track);
                  }
                }}
              >
                {isCurrentTrack && isPlaying ? (
                  <>
                    <Pause className="mr-2 size-3" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 size-3" />
                    Play
                  </>
                )}
              </DropdownMenuItem>
              {isDevelopment ? (
                <>
                  <DropdownMenuItem
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSongAction(track.id);
                    }}
                  >
                    <Trash className="mr-2 size-3" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="text-xs">
                      <Plus className="mr-2 size-3" />
                      Add to Playlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      {playlists.map((playlist) => (
                        <DropdownMenuItem
                          className="text-xs"
                          key={playlist.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToPlaylistAction(playlist.id, track.id);
                          }}
                        >
                          {playlist.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
      {(isSelected || isFocused) && (
        <td
          className="pointer-events-none absolute inset-0 border border-[#1e3a8a]"
          colSpan={6}
        />
      )}
    </tr>
  );
}

export function TrackTable({
  playlist,
  query,
}: {
  playlist: PlaylistWithSongs;
  query?: string;
}) {
  const tableRef = useRef<HTMLTableElement>(null);
  const { registerPanelRef, setActivePanel, setPlaylist } = usePlayback();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Song;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    registerPanelRef('tracklist', tableRef as React.RefObject<HTMLElement>);
  }, [registerPanelRef]);

  useEffect(() => {
    setPlaylist(playlist.songs);
  }, [playlist.songs, setPlaylist]);

  const sortedTracks = useMemo(() => {
    const sortableTracks: Song[] = [...playlist.songs];
    if (sortConfig !== null) {
      sortableTracks.sort((a, b) => {
        if (!a || !b || !sortConfig || !sortConfig.key) return 0;
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue == null || bValue == null) return 0;
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableTracks;
  }, [playlist.songs, sortConfig]);

  const requestSort = (key: keyof Song) => {
    if (sortConfig?.direction === 'desc') {
      setSortConfig(null);
      return;
    }
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <table
      ref={tableRef}
      className="w-full text-xs"
      onClick={() => setActivePanel('tracklist')}
    >
      <thead className="sticky top-0 z-10 border-b border-[#282828] bg-[#0A0A0A]">
        <tr className="text-left text-gray-400">
          <th className="w-10 py-2 pl-3 pr-2 font-medium">#</th>
          <ColumnHeader
            title="Title"
            sortConfig={sortConfig}
            requestSort={requestSort}
            columnKey="name"
          />
          <ColumnHeader
            title="Artist"
            sortConfig={sortConfig}
            requestSort={requestSort}
            columnKey="artist"
            className="hidden sm:table-cell"
          />
          <ColumnHeader
            title="Album"
            sortConfig={sortConfig}
            requestSort={requestSort}
            columnKey="album"
            className="hidden md:table-cell"
          />
          <ColumnHeader
            title="Type"
            sortConfig={sortConfig}
            requestSort={requestSort}
            columnKey="type"
            className="hidden md:table-cell"
          />
          <ColumnHeader
            title="Duration"
            sortConfig={sortConfig}
            requestSort={requestSort}
            columnKey="duration"
          />
        </tr>
      </thead>
      <tbody className="mt-px">
        {sortedTracks.map((track: Song, index: number) => (
          <TrackRow
            key={track.id}
            track={track}
            index={index}
            query={query}
            isSelected={selectedTrackId === track.id}
            onSelect={() => setSelectedTrackId(track.id)}
          />
        ))}
      </tbody>
    </table>
  );
}

const ColumnHeader = ({
  title,
  sortConfig,
  requestSort,
  columnKey,
  className,
}: {
  title: string;
  sortConfig: { key: keyof Song; direction: 'asc' | 'desc' } | null;
  requestSort: (key: keyof Song) => void;
  columnKey: keyof Song;
  className?: string;
}) => {
  return (
    <th
      className={cn(' cursor-pointer select-none p-2 font-medium', className)}
      onClick={() => requestSort(columnKey)}
    >
      <p className="flex items-center">
        {title}
        {sortConfig?.key === columnKey ? (
          sortConfig.direction === 'asc' ? (
            <ArrowUpAZ className="ml-1 size-4" />
          ) : (
            <ArrowUpZA className="ml-1 size-4" />
          )
        ) : null}
      </p>
    </th>
  );
};
