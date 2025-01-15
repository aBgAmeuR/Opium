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

export const getLinks = (links: string[]) => {
  const returnLinks: { link: string; isPillowcase: boolean }[] = [];
  links.forEach((link) => {
    if (
      link.includes('https://pillowcase.su') ||
      link.includes('https://plwcse.top')
    ) {
      const id = link.match(/\/f\/([a-f0-9]{32})/)?.[1];
      if (id) {
        return returnLinks.push({
          link: `https://api.plwcse.top/api/download/${id}`,
          isPillowcase: true,
        });
      }
    }
    return returnLinks.push({ link, isPillowcase: false });
  });
  return returnLinks;
};
