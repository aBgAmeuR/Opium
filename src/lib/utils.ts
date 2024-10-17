import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const extractNoticeAndName = (name: string | null) => {
  const notices = {
    '⭐': 'Best Of',
    '✨': 'Special',
    '🏆': 'Grails',
    '🗑️': 'Worst Of',
    '🤖': 'AI Ref Track',
  } as const;
  const notice =
    Object.entries(notices).find(([notice]) => name?.startsWith(notice))?.[1] ??
    null;

  return {
    notice,
    name: name?.replace(/^(?:⭐|✨|🏆|🗑|🤖) ?/, '') ?? '',
  };
};

export const extractLinks = (links: string | null) =>
  links && links !== 'N/A' ? links.split('\n').map((link) => link.trim()) : [];
