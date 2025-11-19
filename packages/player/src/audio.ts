import { Howl } from "howler";
import { usePlayerStore } from "./store";
import type { Track } from "./types";

let sound: Howl | null = null;
let currentTrackId: string | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

export function initAudio() {
	if (typeof window === "undefined") return;

	usePlayerStore.subscribe((state, prevState) => {
		const {
			queue,
			currentTrackIndex,
			isPlaying,
			volume,
			isMuted,
			seekTrigger,
			repeatMode,
		} = state;

		const currentTrack = queue[currentTrackIndex];

		// 1. Handle Track Change
		if (currentTrack?.id !== currentTrackId) {
			if (sound) {
				sound.unload();
				sound = null;
				stopProgressInterval();
			}

			currentTrackId = currentTrack?.id || null;

			if (currentTrack) {
				sound = new Howl({
					src: [currentTrack.url],
					html5: true, // Stream large files
					volume: isMuted ? 0 : volume / 100,
					onend: () => {
						const currentRepeatMode = usePlayerStore.getState().repeatMode;
						if (currentRepeatMode === "one") {
							usePlayerStore.getState().play();
						} else {
							usePlayerStore.getState().next();
						}
					},
					onplay: () => startProgressInterval(),
					onpause: () => stopProgressInterval(),
					onstop: () => stopProgressInterval(),
					onseek: () => {
						if (sound) {
							usePlayerStore.getState().setCurrentTime(sound.seek());
						}
					},
				});

				if (isPlaying) {
					sound.play();
				}

				updateMediaSession(currentTrack);
			} else {
				// No track
				currentTrackId = null;
				stopProgressInterval();
				usePlayerStore.getState().setCurrentTime(0);
			}
		}

		// 2. Handle Play/Pause
		if (sound) {
			const isSoundPlaying = sound.playing();
			if (isPlaying && !isSoundPlaying) {
				sound.play();
			} else if (!isPlaying && isSoundPlaying) {
				sound.pause();
			}
		}

		// 3. Handle Volume/Mute
		if (sound) {
			sound.volume(isMuted ? 0 : volume / 100);
		}

		// 4. Handle Seek
		if (
			seekTrigger !== null &&
			seekTrigger !== prevState.seekTrigger &&
			sound
		) {
			sound.seek(seekTrigger);
			usePlayerStore.getState().setCurrentTime(seekTrigger);
		}
	});

	setupKeyboardListeners();
}

function startProgressInterval() {
	if (progressInterval) clearInterval(progressInterval);
	progressInterval = setInterval(() => {
		if (sound && sound.playing()) {
			const seek = sound.seek();
			usePlayerStore
				.getState()
				.setCurrentTime(typeof seek === "number" ? seek : 0);
		}
	}, 1000);
}

function stopProgressInterval() {
	if (progressInterval) {
		clearInterval(progressInterval);
		progressInterval = null;
	}
}

function updateMediaSession(track: Track) {
	if (!("mediaSession" in navigator)) return;

	navigator.mediaSession.metadata = new MediaMetadata({
		title: track.title,
		artist: track.artist,
		album: track.title,
		artwork: [
			{
				src: track.artwork,
				sizes: "512x512",
				type: "image/jpeg",
			},
		],
	});

	navigator.mediaSession.setActionHandler("play", () =>
		usePlayerStore.getState().play(),
	);
	navigator.mediaSession.setActionHandler("pause", () =>
		usePlayerStore.getState().pause(),
	);
	navigator.mediaSession.setActionHandler("previoustrack", () =>
		usePlayerStore.getState().prev(),
	);
	navigator.mediaSession.setActionHandler("nexttrack", () =>
		usePlayerStore.getState().next(),
	);
	navigator.mediaSession.setActionHandler("seekto", (details) => {
		if (details.seekTime !== undefined) {
			usePlayerStore.getState().seek(details.seekTime);
		}
	});
}

function setupKeyboardListeners() {
	if (typeof window === "undefined") return;

	window.addEventListener("keydown", (e) => {
		if (
			e.target instanceof HTMLInputElement ||
			e.target instanceof HTMLTextAreaElement
		) {
			return;
		}

		const store = usePlayerStore.getState();

		switch (e.code) {
			case "Space":
				e.preventDefault();
				store.togglePlayPause();
				break;
			case "ArrowRight":
				if (e.metaKey || e.ctrlKey) {
					store.next();
				}
				break;
			case "ArrowLeft":
				if (e.metaKey || e.ctrlKey) {
					store.prev();
				}
				break;
		}
	});
}
