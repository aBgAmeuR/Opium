'use client';

import { EllipsisVertical, Play } from 'lucide-react';

import { RecentSongLinkInfo } from './recent-song-link-info';

import { Button } from '@/components/ui/button';
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza';
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
    <div className="flex items-center gap-2 rounded-md p-2 hover:bg-zinc-900 md:px-4">
      <div className="hidden w-48 md:block">
        <p>{song.era}</p>
        <p>{song.leakDate.toLocaleDateString()}</p>
      </div>
      <div className="line-clamp-3 flex flex-1 flex-col whitespace-pre-line break-all">
        <p>
          <span className="lg:hidden">
            {song.notice === 'Best Of' ? '⭐' : null}
            {song.notice === 'Grails' ? '🏆' : null}
            {song.notice === 'Special' ? '✨' : null}
            {song.notice === 'Worst Of' ? '🗑️' : null}
          </span>
          {song.name.split('\n')[0]}
        </p>
        <p>{song.name.split('\n')[1]}</p>
        <p>{song.name.split('\n')[2]}</p>
      </div>
      <p className="hidden w-20 lg:block">{song.notice}</p>
      <div className="hidden w-32 lg:block">
        <p>{song.quality}</p>
        <p>{song.availability}</p>
      </div>
      <div className="flex flex-col items-end md:hidden">
        <p>{song.era}</p>
        <p>{song.leakDate.toLocaleDateString()}</p>
      </div>
      <div className="flex w-8 flex-col md:flex-row lg:w-24">
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
      <Credenza>
        <CredenzaTrigger asChild>
          <Button size="iconXs" variant="ghost">
            <EllipsisVertical size={20} />
          </Button>
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>{song.name.split('\n')[0]}</CredenzaTitle>
            <CredenzaDescription>{song.notes}</CredenzaDescription>
            <CredenzaDescription>
              {song.trackLength ? `${song.trackLength} | ` : null}
              {song.links.length} links
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="flex w-full flex-col gap-6">
              {/* {links.map((link, index) => (
                <div
                  className="border-border-color relative flex w-full flex-col gap-8 rounded-3xl border px-24 py-12 pb-24"
                  key={index}
                >
                  <div className="bg-background text-muted-foreground absolute -top-3 left-6 flex items-start justify-center gap-4 px-4 text-sm">
                    Info
                  </div>
                  <div className="flex w-full flex-col gap-4"></div>
                  <div className="flex w-full flex-col gap-8"></div>
                </div>
              ))} */}
              {song.links.map((link, index) => (
                <RecentSongLinkInfo key={index} link={link} />
              ))}
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <button>Close</button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  );
};
