export interface Track {
	id: string;
	url: string;
	title: string;
	artist: string;
	artwork: string;
	type?: string;
	artistId?: number;
	albumId?: number;
	duration?: number;
}

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
	queue: Track[];
	currentTrackIndex: number;
	isPlaying: boolean;
	volume: number;
	isMuted: boolean;
	isShuffle: boolean;
	repeatMode: RepeatMode;
	activeId: string | null;
	seekTrigger: number | null;
	currentTime: number;
}

export interface PlayerActions {
	play: (track?: Track) => void;
	pause: () => void;
	togglePlayPause: () => void;
	next: () => void;
	prev: () => void;
	seek: (time: number) => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	toggleShuffle: () => void;
	toggleRepeat: () => void;
	setQueue: (tracks: Track[]) => void;
	addToQueue: (track: Track) => void;
	removeFromQueue: (trackId: string) => void;
	reorderQueue: (newQueue: Track[]) => void;
	playNext: (track: Track) => void;
	setCurrentTime: (time: number) => void;
}

export type PlayerStore = PlayerState & PlayerActions;
