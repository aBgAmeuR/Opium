import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { RecentTrack } from '@/types/recent-tracks';

interface SongPlayStore {
  song: RecentTrack | null;
  setSong: (song: RecentTrack) => void;
}

export const useSongPlayStore = create<SongPlayStore>((set) => ({
  song: null,
  setSong: (song) => set({ song }),
}));

interface RecentSongsFiltersStore {
  search: string;
  eras: string[];
  notices: string[];
  types: string[];
  qualities: string[];
  availabilities: string[];
  setSearch: (search: string) => void;
  setEras: (eras: string[]) => void;
  setNotices: (notices: string[]) => void;
  setTypes: (types: string[]) => void;
  setQualities: (qualities: string[]) => void;
  setAvailabilities: (availabilities: string[]) => void;
  resetFilters: () => void;
}

export const useRecentSongsFiltersStore = create(
  persist<RecentSongsFiltersStore>(
    (set) => ({
      search: '',
      eras: [],
      notices: [],
      types: [],
      qualities: [],
      availabilities: [],
      setSearch: (search) => set({ search }),
      setEras: (eras) => set({ eras }),
      setNotices: (notices) => set({ notices }),
      setTypes: (types) => set({ types }),
      setQualities: (qualities) => set({ qualities }),
      setAvailabilities: (availabilities) => set({ availabilities }),
      resetFilters: () =>
        set({
          search: '',
          eras: [],
          notices: [],
          types: [],
          qualities: [],
          availabilities: [],
        }),
    }),
    { name: 'recent-songs-filters' }
  )
);
