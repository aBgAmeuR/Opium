'use client';

import { motion } from 'framer-motion';
import { FastForward, Pause, Play } from 'lucide-react';

import { Button } from '../ui/button';
import { Marquee } from '../ui/marquee';
import { VolumeSlider } from './volume-slider';

import { useWaveSurfer } from '@/hooks/use-wavesurfer';
import { useSongPlayStore } from '@/lib/store';

export const MusicPlayer = () => {
  const track = useSongPlayStore((s) => s.song);
  const {
    handlePlayPause,
    isPlaying,
    containerRef,
    handleBackward,
    handleForward,
    handleVolume,
  } = useWaveSurfer({
    track,
  });

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
      <motion.div
        className="ml-2 flex w-24 items-center gap-2 overflow-hidden pr-4"
        animate={
          track
            ? { width: 'auto' }
            : { width: 0, marginLeft: 0, paddingRight: 0 }
        }
        transition={{ duration: 0.5 }}
      >
        <div className="w-32">
          <Marquee
            className="text-primary line-clamp-1 text-xs"
            text={track?.name}
          />
        </div>
        <div id="waveform" className="w-60" ref={containerRef} />
        <div className="controls flex gap-1">
          <Button variant="ghost" size="icon" onClick={handleBackward}>
            <FastForward fill="white" className="rotate-180" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePlayPause}>
            {!isPlaying ? <Play fill="white" /> : <Pause fill="white" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleForward}>
            <FastForward onClick={handleForward} fill="white" />
          </Button>
        </div>
        <VolumeSlider handleVolume={handleVolume} />
      </motion.div>
    </motion.div>
  );
};
