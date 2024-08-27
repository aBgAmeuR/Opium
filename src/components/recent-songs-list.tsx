'use client';

import React, { useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { RecentSong } from './recent-song';

import { cn } from '@/lib/utils';
import { RecentTrack } from '@/types/recent-tracks';

type RecentSongsListProps = {
  data: RecentTrack[];
  className?: string;
};

export const RecentSongsList = ({ data, className }: RecentSongsListProps) => {
  const tracks = useMemo(() => data, [data]);

  return (
    <div className={cn('h-5/6 resize overflow-hidden p-4', className)}>
      <Virtuoso
        data={tracks}
        itemContent={(index, track) => <RecentSong key={index} song={track} />}
      />
    </div>
  );
};
