import {
	$audio,
	type AudioStore,
	calculateNextIndex,
	canUseDOM,
	type Track,
	useAudioStore,
} from "@opium/audio";
import React from "react";

const MAX_ERROR_RETRIES = 3;
const ERROR_RETRY_DELAY = 1000;

export function AudioProvider({ children }: React.PropsWithChildren) {
	const preloadAudioRef = React.useRef<HTMLAudioElement | null>(null);
	const errorRetryCountRef = React.useRef<number>(0);
	const lastUpdateTimeRef = React.useRef<number>(0);

	const throttleInterval = 100;
	const minUpdateThreshold = 0.5;

	const setState = React.useCallback(
		(
			partial:
				| Partial<AudioStore>
				| ((state: AudioStore) => Partial<AudioStore>),
		) => {
			useAudioStore.setState(partial);
		},
		[],
	);

	const retryPlayback = React.useCallback(async (audio: HTMLAudioElement) => {
		if (errorRetryCountRef.current >= MAX_ERROR_RETRIES) {
			return false;
		}

		errorRetryCountRef.current += 1;
		const delay = 2 ** (errorRetryCountRef.current - 1) * ERROR_RETRY_DELAY;
		await new Promise((resolve) => setTimeout(resolve, delay));

		if (typeof navigator !== "undefined" && !navigator.onLine) {
			console.warn("Offline, delaying retry attempt further.");
			return false;
		}

		try {
			console.log(
				`Retry attempt ${errorRetryCountRef.current}: Loading audio...`,
			);
			const currentTime = audio.currentTime;
			const wasPlaying = !audio.paused;
			const state = useAudioStore.getState();

			if (state.currentTrack) {
				await $audio.load(state.currentTrack.url, currentTime);
				if (wasPlaying) {
					await $audio.play();
				}
			}
			return true;
		} catch (error) {
			console.error("Retry attempt failed:", error);
			return false;
		}
	}, []);

	const throttledTimeUpdate = React.useCallback(() => {
		const now = Date.now();
		if (now - lastUpdateTimeRef.current < throttleInterval) {
			return;
		}
		lastUpdateTimeRef.current = now;

		const audio = $audio.getAudioElement();
		if (!audio) {
			return;
		}

		const currentTime = audio.currentTime;
		const state = useAudioStore.getState();

		if (Math.abs(state.currentTime - currentTime) > minUpdateThreshold) {
			const duration = audio.duration;
			const newProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
			useAudioStore.setState({ currentTime, progress: newProgress });
		}
	}, []);

	const preloadTrack = React.useCallback((song: Track) => {
		if (!preloadAudioRef.current || preloadAudioRef.current.src === song.url) {
			return;
		}

		try {
			preloadAudioRef.current.src = song.url;
			preloadAudioRef.current.preload = "auto";
			preloadAudioRef.current.load();
		} catch (error) {
			console.error("Failed to preload next track:", error);
			if (preloadAudioRef.current) {
				preloadAudioRef.current.src = "";
			}
		}
	}, []);

	const preloadNextTrack = React.useCallback(() => {
		if (!preloadAudioRef.current) {
			return;
		}

		const state = useAudioStore.getState();
		const nextIndex = calculateNextIndex(
			state.queue,
			state.currentQueueIndex,
			state.shuffleEnabled,
			state.repeatMode,
		);

		if (nextIndex === -1 || nextIndex >= state.queue.length) {
			return;
		}

		const nextSong = state.queue[nextIndex];

		if (!nextSong || nextSong.id === state.currentTrack?.id) {
			return;
		}

		preloadTrack(nextSong);
	}, [preloadTrack]);

	React.useEffect(() => {
		if (!canUseDOM()) {
			return;
		}

		$audio.init();
		preloadAudioRef.current = new Audio();
		preloadAudioRef.current.muted = true;
		preloadAudioRef.current.preload = "none";

		const audio = $audio.getAudioElement();
		if (!audio) {
			console.error("Audio element initialization failed");
			return;
		}

		const handlePlay = () => {
			errorRetryCountRef.current = 0;
			setState({ isPlaying: true, isLoading: false, isBuffering: false });
			preloadNextTrack();
		};

		const handlePause = () => {
			setState({ isPlaying: false, isBuffering: false });
		};

		const getErrorInfo = (
			errorCode: number,
		): { message: string; recoverable: boolean } => {
			switch (errorCode) {
				case MediaError.MEDIA_ERR_ABORTED:
					return { message: "Playback cancelled", recoverable: true };
				case MediaError.MEDIA_ERR_NETWORK:
					return { message: "Network error", recoverable: true };
				case MediaError.MEDIA_ERR_DECODE:
					return {
						message: "Audio file decoding error",
						recoverable: false,
					};
				case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
					return {
						message: "File/network loading error (Code 4)",
						recoverable: true,
					};
				default:
					return {
						message: `Unknown error (${errorCode})`,
						recoverable: true,
					};
			}
		};

		const parseError = (
			e: Event,
		): { message: string; recoverable: boolean; errorCode: number } => {
			if (audio.error) {
				const errorCode = audio.error.code;
				const errorInfo = getErrorInfo(errorCode);
				return { ...errorInfo, errorCode };
			}
			if (e instanceof ErrorEvent) {
				return { message: e.message, recoverable: true, errorCode: 0 };
			}
			return {
				message: "Unknown audio error",
				recoverable: false,
				errorCode: 0,
			};
		};

		const handleErrorRetry = async (
			audioElement: HTMLAudioElement,
			recoverable: boolean,
		): Promise<boolean> => {
			if (!recoverable || errorRetryCountRef.current >= MAX_ERROR_RETRIES) {
				return false;
			}
			return await retryPlayback(audioElement);
		};

		const handleError = async (e: Event) => {
			const { message: initialMessage, recoverable, errorCode } = parseError(e);

			console.error("Audio error details:", {
				event: e,
				audioError: audio.error,
				message: initialMessage,
				recoverable,
				code: errorCode,
				src: audio.src,
				readyState: audio.readyState,
				networkState: audio.networkState,
			});

			if (await handleErrorRetry(audio, recoverable)) {
				return;
			}

			const finalMessage =
				recoverable && errorRetryCountRef.current >= MAX_ERROR_RETRIES
					? `Failed after ${MAX_ERROR_RETRIES} attempts: ${initialMessage}`
					: initialMessage;

			setState({
				isPlaying: false,
				isLoading: false,
				isBuffering: false,
				isError: true,
				errorMessage: finalMessage,
			});
		};

		const handleEnded = async () => {
			setState({ isPlaying: false, isBuffering: false });
			const state = useAudioStore.getState();

			if (state.repeatMode === "one" && state.currentTrack) {
				try {
					await $audio.load(state.currentTrack.url, 0);
					await $audio.play();
					setState({ currentTime: 0, progress: 0 });
					return;
				} catch (error) {
					console.error("Repeat mode playback error:", error);
				}
			}

			state.handleTrackEnd();
		};

		const handleLoadStart = () => {
			setState({
				isLoading: true,
				isBuffering: false,
				isError: false,
				errorMessage: null,
			});
		};

		const handleCanPlay = () => {
			const duration = audio.duration || 0;
			setState({
				isLoading: false,
				isBuffering: false,
				duration,
				isError: false,
				errorMessage: null,
			});
		};

		const handleWaiting = () => {
			setState({ isBuffering: true, isLoading: false });
		};

		const handlePlaying = () => {
			setState({
				isLoading: false,
				isBuffering: false,
				isPlaying: true,
				isError: false,
				errorMessage: null,
			});
		};

		const handleDurationChange = () => {
			const duration = audio.duration || 0;
			setState({ duration });
		};

		const handleVolumeChange = () => {
			setState({ volume: audio.volume, isMuted: audio.muted });
		};

		const handleBufferUpdate = (e: Event) => {
			if (e instanceof CustomEvent && e.detail?.bufferedTime !== undefined) {
				setState({ bufferedTime: e.detail.bufferedTime });
			}
		};

		const restoreState = async () => {
			const state = useAudioStore.getState();
			if (!state.currentTrack || state.currentTime <= 0) {
				return;
			}

			const track = state.currentTrack;
			const startTime = state.currentTime;
			const volume = state.volume;
			const muted = state.isMuted;

			try {
				setState({ isLoading: true });
				await $audio.load(track.url, startTime);
				$audio.setVolume(volume);
				$audio.setMuted(muted);
				setState({ isLoading: false, isPlaying: false });
			} catch (error) {
				console.error("State restoration error:", error);
				setState({
					isError: true,
					errorMessage: "Error restoring audio state",
					isPlaying: false,
					isLoading: false,
					isBuffering: false,
				});
			}
		};

		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("playing", handlePlaying);
		audio.addEventListener("waiting", handleWaiting);
		audio.addEventListener("loadstart", handleLoadStart);
		audio.addEventListener("canplay", handleCanPlay);
		audio.addEventListener("canplaythrough", handleCanPlay);
		audio.addEventListener("timeupdate", throttledTimeUpdate);
		audio.addEventListener("durationchange", handleDurationChange);
		audio.addEventListener("loadedmetadata", handleDurationChange);
		audio.addEventListener("volumechange", handleVolumeChange);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("error", handleError);

		$audio.addEventListener("bufferUpdate", handleBufferUpdate);

		restoreState();

		const unsubscribe = useAudioStore.subscribe(
			(state) => state.currentTrack?.id,
			(newSongId, oldSongId) => {
				if (newSongId && newSongId !== oldSongId) {
					errorRetryCountRef.current = 0;
					preloadNextTrack();
				}
			},
		);

		return () => {
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("playing", handlePlaying);
			audio.removeEventListener("waiting", handleWaiting);
			audio.removeEventListener("loadstart", handleLoadStart);
			audio.removeEventListener("canplay", handleCanPlay);
			audio.removeEventListener("canplaythrough", handleCanPlay);
			audio.removeEventListener("timeupdate", throttledTimeUpdate);
			audio.removeEventListener("durationchange", handleDurationChange);
			audio.removeEventListener("loadedmetadata", handleDurationChange);
			audio.removeEventListener("volumechange", handleVolumeChange);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("error", handleError);
			$audio.removeEventListener("bufferUpdate", handleBufferUpdate);

			if (preloadAudioRef.current) {
				preloadAudioRef.current.src = "";
				preloadAudioRef.current = null;
			}
			unsubscribe();
		};
	}, [throttledTimeUpdate, setState, retryPlayback, preloadNextTrack]);

	React.useEffect(() => {
		const unsubscribe = useAudioStore.subscribe(
			(state) => state.queue,
			(newQueue, oldQueue) => {
				if (
					(newQueue.length !== oldQueue.length || newQueue.length === 0) &&
					preloadAudioRef.current
				) {
					preloadAudioRef.current.src = "";
				}
			},
		);

		return unsubscribe;
	}, []);

	return children;
}
