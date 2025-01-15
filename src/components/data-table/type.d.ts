import { RecentTrack } from '@/types/recent-tracks';

export type Item = RecentTrack & {
  note: string;
};
