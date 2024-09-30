import { useEffect, useRef, useState } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';

import { RecentTrack } from '@/types/recent-tracks';

type WaveSurferProps = {
  container: HTMLDivElement;
  url: string;
};

export const createWaveSurferOptions = ({
  container,
  url,
}: WaveSurferProps): WaveSurferOptions => ({
  container,
  waveColor: '#71717a',
  progressColor: '#e4e4e7',
  cursorColor: '#e52d27',
  cursorWidth: 2,
  dragToSeek: true,
  hideScrollbar: true,
  url,
  barWidth: 2,
  barRadius: 5,
  barGap: 2,
  barHeight: 2,
  height: 32,
  width: 240,
  normalize: true,
  minPxPerSec: 1,
});

type UseWaveSurferProps = {
  track: RecentTrack | null;
};

export const useWaveSurfer = ({ track }: UseWaveSurferProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const url = track?.links[0];

  useEffect(() => {
    if (!containerRef.current || !url) return;

    const options = createWaveSurferOptions({
      container: containerRef.current,
      url,
    });
    wavesurferRef.current = WaveSurfer.create(options);

    const wavesurfer = wavesurferRef.current;

    wavesurfer.on('play', () => setIsPlaying(true));
    wavesurfer.on('pause', () => setIsPlaying(false));
    wavesurfer.on('finish', () => setIsPlaying(false));
    wavesurfer.on('destroy', () => setIsPlaying(false));
    wavesurfer.on('error', () => setIsPlaying(false));
    wavesurfer.on('loading', () => setIsPlaying(false));
    wavesurfer.on('dragend', () => wavesurfer.play());
    wavesurfer.on('interaction', () => wavesurfer.play());
    wavesurfer.on('ready', () => wavesurfer.play());
    wavesurfer.setVolume(volume);

    return () => {
      wavesurfer.destroy();
    };
  }, [url]);

  const handlePlayPause = () => {
    if (!wavesurferRef.current) return;
    setIsPlaying(!isPlaying);
    wavesurferRef.current.playPause();
  };

  const handleForward = () => {
    wavesurferRef.current?.skip(5);
  };

  const handleBackward = () => {
    wavesurferRef.current?.skip(-5);
  };

  const handleVolume = (volume: number) => {
    setVolume(volume);
    wavesurferRef.current?.setVolume(volume);
  };

  return {
    containerRef,
    handlePlayPause,
    isPlaying,
    handleForward,
    handleBackward,
    handleVolume,
  };
};
