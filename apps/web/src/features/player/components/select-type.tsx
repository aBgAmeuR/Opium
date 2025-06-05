'use client';

import { useId, useState } from 'react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type SelectTypeProps = {
  types: string[];
};

export default function SelectType({ types }: SelectTypeProps) {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState('All');

  return (
    <div className="bg-input/50 inline-flex h-9 rounded-lg p-0.5">
      <RadioGroup
        value={selectedValue}
        onValueChange={setSelectedValue}
        className="after:bg-background has-[:focus-visible]:after:outline-ring/70 group relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-sm font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:shadow-sm after:shadow-black/5 after:outline-offset-2 after:transition-transform after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-[:focus-visible]:after:outline has-[:focus-visible]:after:outline-2 data-[state=off]:after:translate-x-0 data-[state=on]:after:translate-x-full"
        data-state={selectedValue}
      >
        {types.map((type, index) => (
          <label
            key={index}
            className="group-data-[state=on]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors"
          >
            {type}
            <RadioGroupItem
              id={`${id}-${index}`}
              value="off"
              className="sr-only"
            />
          </label>
        ))}
        {/* <label
          key={'all-types'}
          className="group-data-[state=on]:text-muted-foreground/70 relative z-10 inline-flex h-full min-w-8 cursor-pointer select-none items-center justify-center whitespace-nowrap px-4 transition-colors"
        >
          All
          <RadioGroupItem id={`all-types`} value="off" className="sr-only" />
        </label> */}
      </RadioGroup>
    </div>
  );
}
