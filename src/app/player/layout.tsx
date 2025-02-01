import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

import { NowPlaying } from '@/features/player/components/now-playing';
import { PlaybackProvider } from '@/features/player/components/playback/playback-context';
import { PlaybackControls } from '@/features/player/components/playback/playback-controls';
import { OptimisticPlaylists } from '@/features/player/components/playlists/optimistic-playlists';
import { PlaylistProvider } from '@/features/player/hooks/use-playlist';
import { getAllPlaylists } from '@/features/player/queries';

export const metadata: Metadata = {
  title: 'Next.js Music Player',
  description: 'A music player built with Next.js.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const playlistsPromise = getAllPlaylists();

  return (
    <html lang="en" className={inter.className}>
      <body className="dark flex h-dvh flex-col bg-[#0A0A0A] text-gray-200 md:flex-row">
        <PlaybackProvider>
          <PlaylistProvider playlistsPromise={playlistsPromise}>
            <OptimisticPlaylists />
            {children}
          </PlaylistProvider>
          <NowPlaying />
          <PlaybackControls />
        </PlaybackProvider>
      </body>
    </html>
  );
}
