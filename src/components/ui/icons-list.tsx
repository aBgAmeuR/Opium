import { PropsWithChildren } from 'react';

import { MotionDiv } from '../framer-motion';
import { Icons } from '../icons';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { siteConfig } from '@/lib/constant';
import { cn } from '@/lib/utils';

type TIconsListProps = PropsWithChildren<{
  className?: string;
  anim?: boolean;
}>;

export const IconsList = ({ className, anim, children }: TIconsListProps) => {
  if (anim) {
    return (
      <MotionDiv
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          duration: siteConfig.animationDuration,
          ease: 'easeOut',
        }}
        className={cn('flex gap-1', className)}
      >
        {children}
      </MotionDiv>
    );
  } else {
    return <div className={cn('flex gap-1', className)}>{children}</div>;
  }
};

type TIconItemProps = {
  icon: keyof typeof Icons;
  bigIcon?: boolean;
};

export const IconItem = ({ icon, bigIcon }: TIconItemProps) => {
  const Icon = Icons[icon];
  const tooltipContent = icon.slice(0, 1).toUpperCase() + icon.slice(1);

  return (
    <Tooltip>
      <TooltipTrigger className="group flex h-5 items-center">
        <Icon
          className={cn(
            'size-4 transition-all duration-100 ease-in-out group-hover:size-5 group-focus:size-5',
            bigIcon ? 'size-6 group-hover:size-7 group-focus:size-7' : ''
          )}
        />
      </TooltipTrigger>
      <TooltipContent className="bg-neutral-50  text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
        <p>{tooltipContent}</p>
      </TooltipContent>
    </Tooltip>
  );
};
