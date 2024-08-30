import { Icons } from '@/components/icons';
import { MusicPlayer } from '@/components/music-player/music-player';
import { RecentSongsFilters } from '@/components/recent-songs-filters';
import { RecentSongsList } from '@/components/recent-songs-list';
import { getRecentTracks } from '@/lib/fetch-data';

export default async function Page() {
  const data = await getRecentTracks();

  return (
    <>
      <div className="mx-4 mt-2 flex items-center gap-2 md:mx-8 md:mt-4">
        <Icons.logo size={48} className="h-[50px] w-8 md:h-[75px] md:w-12" />
        <h1 className="text-xl md:text-2xl">Carti Tracker</h1>
      </div>
      <RecentSongsFilters data={data} />
      <RecentSongsList data={data} />
      <MusicPlayer />
    </>
  );
}
