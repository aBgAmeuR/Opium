export type RecentTrack = {
  era: string;
  notice:
    | 'Best Of'
    | 'Special'
    | 'Grails'
    | 'Wanted'
    | 'Worst Of'
    | 'AI Ref Track'
    | null;
  name: string;
  notes: string;
  trackLength: string;
  leakDate: Date;
  fileDate: Date | null;
  type: string;
  availability: string;
  quality: string;
  links: string[];
};
