import { motion } from 'framer-motion';
import { FastForward, Pause, Play } from 'lucide-react';

import { VolumeSlider } from '@/components/music-player/volume-slider';
import { Button } from '@/components/ui/button';
import { Marquee } from '@/components/ui/marquee';
import { RecentTrack } from '@/types/recent-tracks';

type MusicPlayerSongInfosProps = {
  track: RecentTrack;
  handlePlayPause: () => void;
  isPlaying: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  handleBackward: () => void;
  handleForward: () => void;
  handleVolume: (volume: number) => void;
};

export const MusicPlayerSongInfos = ({
  track,
  handlePlayPause,
  isPlaying,
  containerRef,
  handleBackward,
  handleForward,
  handleVolume,
}: MusicPlayerSongInfosProps) => {
  return (
    <motion.div
      className="ml-2 flex w-24 items-center gap-2 overflow-hidden pr-4"
      animate={
        track ? { width: 'auto' } : { width: 0, marginLeft: 0, paddingRight: 0 }
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
  );
};
