'use client';

import { Play } from 'lucide-react';

import { Button } from './ui/button';

import { useSongPlayStore } from '@/lib/store';
import { RecentTrack } from '@/types/recent-tracks';

const getLinks = (links: string[]) => {
  const returnLinks: string[] = [];
  links.forEach((link) => {
    if (
      link.includes('https://pillowcase.su') ||
      link.includes('https://plwcse.top')
    ) {
      const id = link.match(/\/f\/([a-f0-9]{32})/)?.[1];
      if (id) {
        returnLinks.push(`https://api.plwcse.top/api/download/${id}`);
      }
    }
  });
  return returnLinks;
};

type RecentSongProps = {
  song: RecentTrack;
};

export const RecentSong = ({ song }: RecentSongProps) => {
  const setSong = useSongPlayStore((s) => s.setSong);
  const links = getLinks(song.links);

  return (
    <div className="flex items-center gap-2 rounded-md px-4 py-2 hover:bg-zinc-900">
      <div className="w-48">
        <p>{song.era}</p>
        <p>{song.leakDate.toLocaleDateString()}</p>
      </div>
      <h1 className="line-clamp-3 flex flex-1 whitespace-pre-line break-all">
        {song.name}
      </h1>
      <p className="w-20">{song.notice}</p>
      <div className="w-32">
        <p>{song.quality}</p>
        <p>{song.availability}</p>
      </div>
      <div className="w-24">
        {links.slice(0, 3).map((link, index) => (
          <Button
            key={index}
            size="iconXs"
            variant="ghost"
            onClick={() => setSong({ ...song, links: [link] })}
          >
            <Play size={20} />
          </Button>
        ))}
      </div>
    </div>
  );
};
