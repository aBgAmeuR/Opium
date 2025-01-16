import { ReactNode } from 'react';

import { RecentTrack } from '@/types/recent-tracks';

export type Item = RecentTrack & {
  note: ReactNode;
};
