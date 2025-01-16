'use client';

import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

import { Button } from './ui/button';

type AudioPlayerProps = {
  src: string;
};

export const AudioPlayer = ({ src }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <audio ref={audioRef} src={src} />
      <Button size="icon" onClick={togglePlayPause}>
        {isPlaying ? (
          <Pause size={16} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Play size={16} strokeWidth={2} aria-hidden="true" />
        )}
      </Button>
    </div>
  );
};
