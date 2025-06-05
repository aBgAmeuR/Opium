'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex touch-none select-none items-center',
      orientation === 'vertical' ? 'h-full w-[20px] flex-col' : 'w-full',
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={cn(
        'bg-secondary relative grow overflow-hidden rounded-full',
        orientation === 'vertical' ? 'h-full w-2' : 'h-2 w-full'
      )}
    >
      <SliderPrimitive.Range
        className={cn(
          'bg-gradient-to-topleft absolute h-full',
          orientation === 'vertical' ? 'w-full' : 'h-full'
        )}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-primary ring-offset-background focus-visible:ring-ring bg-gradient-to-topleft block size-4 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
