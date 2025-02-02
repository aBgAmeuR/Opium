'use client';

import { use, useEffect, useRef } from 'react';
import { ObjectId } from 'bson';
import { MoreVertical, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { createPlaylistAction, deletePlaylistAction } from '../../actions';
import { usePlaylist } from '../../hooks/use-playlist';
import { Playlist } from '../../types';
import { usePlayback } from '../playback/playback-context';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SearchInput } from '../search';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { env } from '@/env.mjs';

const isDevelopment = env.NEXT_PUBLIC_DEVELOPMENT;

function PlaylistRow({ playlist }: { playlist: Playlist }) {
  const pathname = usePathname();
  const router = useRouter();
  const { deletePlaylist } = usePlaylist();

  async function handleDeletePlaylist(id: string) {
    deletePlaylist(id);

    if (pathname === `/player/p/${id}`) {
      router.prefetch('/');
      router.push('/');
    }

    deletePlaylistAction(id);
    router.refresh();
  }

  return (
    <li className="group relative">
      <Link
        prefetch={true}
        href={`/player/p/${playlist.id}`}
        className={`block cursor-pointer px-4 py-1 text-[#d1d5db] hover:bg-[#1A1A1A] focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${
          pathname === `/player/p/${playlist.id}` ? 'bg-[#1A1A1A]' : ''
        }`}
        tabIndex={0}
      >
        {playlist.name}
      </Link>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
        {isDevelopment ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 text-gray-400 hover:text-white focus:text-white"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Playlist options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem
                disabled={!isDevelopment}
                onClick={() => handleDeletePlaylist(playlist.id)}
                className="text-xs"
              >
                <Trash className="mr-2 size-3" />
                Delete Playlist
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </li>
  );
}

const AlbumRow = ({ album }: { album: string }) => {
  const pathname = usePathname();

  return (
    <li className="group relative">
      <Link
        href={`/player/a/${album}`}
        className={`block cursor-pointer px-4 py-1 text-[#d1d5db] hover:bg-[#1A1A1A] focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${
          pathname === `/player/a/${encodeURIComponent(album)}`
            ? 'bg-[#1A1A1A]'
            : ''
        }`}
        tabIndex={0}
      >
        {album}
      </Link>
    </li>
  );
};

export function OptimisticPlaylists({
  albumsPromise,
}: {
  albumsPromise: Promise<{ album: string | null }[]>;
}) {
  const { playlists, updatePlaylist } = usePlaylist();
  const albums = use(albumsPromise);
  const playlistsContainerRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { registerPanelRef, handleKeyNavigation, setActivePanel } =
    usePlayback();

  useEffect(() => {
    registerPanelRef(
      'sidebar',
      playlistsContainerRef as React.RefObject<HTMLUListElement>
    );
  }, [registerPanelRef]);

  async function addPlaylistAction() {
    const newPlaylistId = new ObjectId().toString();
    const newPlaylist = {
      id: newPlaylistId,
      name: 'New Playlist',
      coverUrl: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    updatePlaylist(newPlaylistId, newPlaylist);
    router.prefetch(`player/p/${newPlaylistId}`);
    router.push(`player/p/${newPlaylistId}`);
    createPlaylistAction(newPlaylistId, 'New Playlist');
    router.refresh();
  }

  return (
    <div
      className="hidden h-dvh w-56 overflow-auto bg-[#121212] md:block"
      onClick={() => setActivePanel('sidebar')}
    >
      <div className="m-4">
        <SearchInput />
        <div className="mb-6">
          <Link
            href="/player"
            className={`-mx-4 block px-4 py-1 text-xs text-[#d1d5db] transition-colors hover:bg-[#1A1A1A] focus:outline-none focus:ring-[0.5px] focus:ring-gray-400 ${
              pathname === '/' ? 'bg-[#1A1A1A]' : ''
            }`}
          >
            All Tracks
          </Link>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/player"
            className="text-xs font-semibold text-gray-400 transition-colors hover:text-white"
          >
            Albums
          </Link>
        </div>
      </div>

      <ul
        ref={playlistsContainerRef}
        className="mb-8 mt-px space-y-0.5 text-xs"
        onKeyDown={(e) => handleKeyNavigation(e, 'sidebar')}
      >
        {albums.map(({ album }) =>
          album ? <AlbumRow key={album} album={album} /> : null
        )}
      </ul>
      <div className="mx-4 mb-4 flex items-center justify-between">
        <Link
          href="/player"
          className="text-xs font-semibold text-gray-400 transition-colors hover:text-white"
        >
          Playlists
        </Link>
        {isDevelopment ? (
          <form action={addPlaylistAction}>
            <Button
              variant="ghost"
              size="icon"
              className="size-5"
              type="submit"
            >
              <Plus className="size-3 text-gray-400" />
              <span className="sr-only">Add new playlist</span>
            </Button>
          </form>
        ) : null}
      </div>
      <ul
        ref={playlistsContainerRef}
        className="mt-px space-y-0.5 text-xs"
        onKeyDown={(e) => handleKeyNavigation(e, 'sidebar')}
      >
        {playlists.map((playlist) => (
          <PlaylistRow key={playlist.id} playlist={playlist} />
        ))}
      </ul>
    </div>
  );
}
