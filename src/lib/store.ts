import { create } from 'zustand';

import { RecentTrack } from '@/types/recent-tracks';

interface SongPlayStore {
  song: RecentTrack | null;
  setSong: (song: RecentTrack) => void;
}

export const useSongPlayStore = create<SongPlayStore>((set) => ({
  song: null,
  setSong: (song) => set({ song }),
}));
