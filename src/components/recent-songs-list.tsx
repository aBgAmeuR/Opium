'use client';

import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { RecentSong } from './recent-song';

import { useRecentSongsFiltersStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { RecentTrack } from '@/types/recent-tracks';

type RecentSongsListProps = {
  data: RecentTrack[];
  className?: string;
};

export const RecentSongsList = ({ data, className }: RecentSongsListProps) => {
  const { search, eras, notices, types, qualities, availabilities } =
    useRecentSongsFiltersStore();

  const tracks = useMemo(() => {
    return data.filter((track) => {
      if (search && !track.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (eras.length > 0 && !eras.includes(track.era)) return false;
      if (notices.length > 0 && !notices.includes(track.notice as string))
        return false;
      if (types.length > 0 && !types.includes(track.type)) return false;
      if (qualities.length > 0 && !qualities.includes(track.quality))
        return false;
      if (
        availabilities.length > 0 &&
        !availabilities.includes(track.availability)
      )
        return false;
      return true;
    });
  }, [data, search, eras, notices, types, qualities, availabilities]);

  return (
    <div className={cn('h-5/6 overflow-hidden p-4', className)}>
      <Virtuoso
        data={tracks}
        itemContent={(index, track) => <RecentSong key={index} song={track} />}
      />
    </div>
  );
};
