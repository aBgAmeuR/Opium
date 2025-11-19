import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlayerState, PlayerStore, RepeatMode, Track } from "./types";

const initialState: PlayerState = {
	queue: [],
	currentTrackIndex: -1,
	isPlaying: false,
	volume: 1,
	isMuted: false,
	isShuffle: false,
	repeatMode: "off",
	activeId: null,
	seekTrigger: null,
	currentTime: 0,
};

export const usePlayerStore = create<PlayerStore>()(
	persist(
		(set, get) => ({
			...initialState,

			play: (track?: Track) => {
				const { queue, currentTrackIndex } = get();
				if (track) {
					// If track is provided, find it in queue or add it
					const index = queue.findIndex((t) => t.id === track.id);
					if (index !== -1) {
						set({
							currentTrackIndex: index,
							activeId: track.id,
							isPlaying: true,
						});
					} else {
						// Add to queue and play
						const newQueue = [...queue, track];
						set({
							queue: newQueue,
							currentTrackIndex: newQueue.length - 1,
							activeId: track.id,
							isPlaying: true,
						});
					}
				} else {
					// Just resume
					if (queue.length > 0 && currentTrackIndex === -1) {
						set({
							currentTrackIndex: 0,
							activeId: queue[0]?.id ?? null,
							isPlaying: true,
						});
					} else {
						set({ isPlaying: true });
					}
				}
			},

			pause: () => set({ isPlaying: false }),

			togglePlayPause: () => {
				const { isPlaying, queue, currentTrackIndex } = get();
				if (!isPlaying && queue.length > 0 && currentTrackIndex === -1) {
					set({
						isPlaying: true,
						currentTrackIndex: 0,
						activeId: queue[0]?.id ?? null,
					});
				} else {
					set({ isPlaying: !isPlaying });
				}
			},

			next: () => {
				const { queue, currentTrackIndex, repeatMode, isShuffle } = get();
				if (queue.length === 0) return;

				let nextIndex = currentTrackIndex + 1;

				if (isShuffle) {
					// Simple shuffle: pick random index that is not current
					if (queue.length > 1) {
						do {
							nextIndex = Math.floor(Math.random() * queue.length);
						} while (nextIndex === currentTrackIndex);
					} else {
						nextIndex = 0;
					}
				} else {
					if (nextIndex >= queue.length) {
						if (repeatMode === "all") {
							nextIndex = 0;
						} else {
							// End of queue, stop
							set({
								isPlaying: false,
								currentTrackIndex: 0,
								activeId: queue[0]?.id ?? null,
							});
							return;
						}
					}
				}

				set({
					currentTrackIndex: nextIndex,
					activeId: queue[nextIndex]?.id ?? null,
					isPlaying: true,
				});
			},

			prev: () => {
				const { queue, currentTrackIndex, repeatMode } = get();
				if (queue.length === 0) return;

				let prevIndex = currentTrackIndex - 1;

				if (prevIndex < 0) {
					if (repeatMode === "all") {
						prevIndex = queue.length - 1;
					} else {
						prevIndex = 0;
					}
				}

				set({
					currentTrackIndex: prevIndex,
					activeId: queue[prevIndex]?.id ?? null,
					isPlaying: true,
				});
			},

			seek: (time: number) => {
				set({ seekTrigger: time, currentTime: time });
			},

			setVolume: (volume: number) => {
				set({ volume, isMuted: volume === 0 });
			},

			toggleMute: () => {
				const { isMuted } = get();
				set({ isMuted: !isMuted });
			},

			toggleShuffle: () => {
				set((state) => ({ isShuffle: !state.isShuffle }));
			},

			toggleRepeat: () => {
				const modes: RepeatMode[] = ["off", "all", "one"];
				set((state) => {
					const nextIndex =
						(modes.indexOf(state.repeatMode) + 1) % modes.length;
					return { repeatMode: modes[nextIndex] };
				});
			},

			setQueue: (tracks: Track[]) => {
				set({
					queue: tracks,
					currentTrackIndex: 0,
					activeId: tracks[0]?.id || null,
					isPlaying: true,
				});
			},

			addToQueue: (track: Track) => {
				set((state) => ({ queue: [...state.queue, track] }));
			},

			removeFromQueue: (trackId: string) => {
				set((state) => {
					const newQueue = state.queue.filter((t) => t.id !== trackId);
					let newIndex = state.currentTrackIndex;

					if (trackId === state.activeId) {
						if (newQueue.length === 0) {
							return {
								queue: [],
								currentTrackIndex: -1,
								activeId: null,
								isPlaying: false,
							};
						}
						newIndex = newIndex >= newQueue.length ? 0 : newIndex;
					} else {
						const removedIndex = state.queue.findIndex((t) => t.id === trackId);
						if (removedIndex < state.currentTrackIndex) {
							newIndex--;
						}
					}

					return {
						queue: newQueue,
						currentTrackIndex: newIndex,
						activeId: newQueue[newIndex]?.id ?? null,
					};
				});
			},

			reorderQueue: (newQueue: Track[]) => {
				set((state) => {
					const currentTrack = state.queue[state.currentTrackIndex];
					const newIndex = currentTrack
						? newQueue.findIndex((t) => t.id === currentTrack.id)
						: -1;

					return {
						queue: newQueue,
						currentTrackIndex: newIndex,
					};
				});
			},

			playNext: (track: Track) => {
				set((state) => {
					const { queue, currentTrackIndex } = state;
					const newQueue = [...queue];
					newQueue.splice(currentTrackIndex + 1, 0, track);
					return { queue: newQueue };
				});
			},

			setCurrentTime: (time: number) => {
				set({ currentTime: time });
			},
		}),
		{
			name: "player-storage",
			partialize: (state) => ({
				volume: state.volume,
				isMuted: state.isMuted,
				isShuffle: state.isShuffle,
				repeatMode: state.repeatMode,
				queue: state.queue,
				currentTrackIndex: state.currentTrackIndex,
				activeId: state.activeId,
			}),
		},
	),
);
