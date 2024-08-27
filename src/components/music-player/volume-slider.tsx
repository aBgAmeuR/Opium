'use client';

import React, { useState } from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

type VolumeSliderProps = {
  handleVolume: (volume: number) => void;
};

export const VolumeSlider = ({ handleVolume }: VolumeSliderProps) => {
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  React.useEffect(() => {
    handleVolume(muted ? 0 : volume);
  }, [muted, volume]);

  return (
    <div className="group flex items-center gap-1">
      <div className="flex w-0 items-center justify-end overflow-x-hidden opacity-0 transition-[width,opacity] delay-100 duration-500 group-hover:w-16 group-hover:overflow-visible group-hover:opacity-100">
        <Slider
          min={0}
          max={1}
          step={0.02}
          value={muted === true ? [0] : [volume]}
          onValueChange={(value) => {
            setMuted(false);
            setVolume(value[0]);
          }}
          className="w-full"
        />
      </div>
      <Button variant="ghost" size="icon" onClick={() => setMuted((m) => !m)}>
        {muted || volume === 0 ? (
          <VolumeX />
        ) : volume < 0.3 ? (
          <Volume />
        ) : volume < 0.7 ? (
          <Volume1 />
        ) : (
          <Volume2 />
        )}
      </Button>
    </div>
  );
};
