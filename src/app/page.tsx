import { Icons } from '@/components/icons';
import { MusicPlayer } from '@/components/music-player/music-player';
import { RecentSongsFilters } from '@/components/recent-songs-filters';
import { RecentSongsList } from '@/components/recent-songs-list';
import { getRecentTracks } from '@/lib/fetch-data';

export default async function Page() {
  const data = await getRecentTracks();

  return (
    <>
      <div className="mx-8 mt-4 flex items-center gap-2">
        <Icons.logo size={48} />
        <h1 className="text-2xl">Carti Tracker</h1>
      </div>
      <RecentSongsFilters data={data} />
      <RecentSongsList data={data} />
      <MusicPlayer />
    </>
  );
}
