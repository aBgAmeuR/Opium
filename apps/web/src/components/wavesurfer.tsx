'use client';

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { createWaveSurferOptions } from '@/hooks/use-wavesurfer';

type WavesurferProps = {
  url: string;
};

export const Wavesurfer = ({ url }: WavesurferProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !url) return;

    const options = createWaveSurferOptions({
      container: containerRef.current,
      url,
    });

    WaveSurfer.create(options);
  }, [url]);

  return (
    <>
      <div ref={containerRef} />
    </>
  );
};
