'use client';

import { motion } from 'framer-motion';
import { Pause, Play } from 'lucide-react';

import { MusicPlayerSongInfos } from './music-player-song-infos';

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
import { useWaveSurfer } from '@/hooks/use-wavesurfer';
import { useSongPlayStore } from '@/lib/store';

export const MusicPlayer = () => {
  const track = useSongPlayStore((s) => s.song);
  const { handlePlayPause, isPlaying } = useWaveSurfer({
    track,
  });

  if (!track) return null;

  console.log(track);

  return (
    <motion.div
      className="bg-primary-foreground fixed bottom-3 left-1/2 flex -translate-x-1/2 items-center rounded-full p-2"
      initial={{ opacity: 0 }}
      animate={track ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={handlePlayPause}
        className="bg-gradient-to-topleft flex size-12 items-center justify-center rounded-full"
      >
        {!isPlaying ? (
          <Play size={20} fill="white" />
        ) : (
          <Pause size={20} fill="white" />
        )}
      </button>
      <Credenza>
        <CredenzaTrigger asChild>
          <MusicPlayerSongInfos track={track} />
        </CredenzaTrigger>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>{track.name.split('\n')[0]}</CredenzaTitle>
            <CredenzaDescription>
              {track.name.split('\n')[1]}
            </CredenzaDescription>
            <CredenzaDescription>
              {track.name.split('\n')[2]}
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="flex w-full flex-col gap-6"></div>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button>Close</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </motion.div>
  );
};
