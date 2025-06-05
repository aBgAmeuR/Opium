/* eslint-disable @typescript-eslint/no-unused-vars */
import Link from 'next/link';

import { AppSidebar } from '@/components/app-sidebar';
import { DataTable } from '@/components/data-table';
import { Icons } from '@/components/icons';
import { MusicPlayer } from '@/components/music-player/music-player';
import { RecentSongsFilters } from '@/components/recent-songs-filters';
import { RecentSongsList } from '@/components/recent-songs-list';
import SearchInput from '@/components/search-input';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getRecentTracks } from '@/lib/fetch-data';
import { cn } from '@/lib/utils';

export default async function Page() {
  const data = await getRecentTracks();
  return (
    <>
      {/* <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="w-full">
          <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <SearchInput />
          </header>
          <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4">
            <div className="flex-1 overflow-auto">
              <DataTable />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider> */}
      <div className="mx-4 mt-2 flex items-center gap-2 md:mx-8 md:mt-4">
        <Icons.logo size={48} className="h-[50px] w-8 md:h-[75px] md:w-12" />
        <h1 className="text-xl md:text-2xl">Carti Tracker</h1>
        <Link
          href="/player"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'ml-2'
          )}
        >
          Go to Player
        </Link>
      </div>
      <RecentSongsFilters data={data} />
      <RecentSongsList data={data} />
      <MusicPlayer />
    </>
  );
}
