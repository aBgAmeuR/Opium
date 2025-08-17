import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { QueueTrack } from './useQueue'
import { useQueue } from './useQueue'

type RepeatMode = 'none' | 'track' | 'queue'

const audio = ref<HTMLAudioElement | null>(null)

const isPlaying = ref(false)
const progress = ref(0)
const duration = ref(0)

const shuffle = ref(false)
const repeatMode = ref<RepeatMode>('none')

const volume = ref(1)
const isMuted = ref(false)

const { queue, currentIndex, current, addQueueChangeCallback, removeQueueChangeCallback, addCurrentTrackRemovedCallback, removeCurrentTrackRemovedCallback } = useQueue()

function applyVolume() {
  if (!audio.value) return
  audio.value.volume = volume.value
  audio.value.muted = isMuted.value
}

function stopAudio() {
  if (!audio.value) return
  audio.value.pause()
  audio.value.currentTime = 0
  isPlaying.value = false
  progress.value = 0
  duration.value = 0
}

function loadAndPlay(track: QueueTrack) {
  queue.value = []
  currentIndex.value = -1
  
  queue.value.push(track)
  currentIndex.value = 0

  nextTick(() => {
    if (!audio.value) return
    audio.value.src = track.url
    audio.value.currentTime = 0
    progress.value = 0
    applyVolume()
    audio.value.play().catch(() => { })
    isPlaying.value = true
  })
}

function playAtIndex(index: number) {
  if (index < 0 || index >= queue.value.length) return
  currentIndex.value = index
  const track = queue.value[index]
  if (!track) return
  nextTick(() => {
    if (!audio.value) return
    audio.value.src = track.url
    if (!Number.isNaN(audio.value.currentTime)) audio.value.currentTime = 0
    applyVolume()
    audio.value.play().catch(() => { })
  })
}

function computeNextIndex(direction: 1 | -1): number {
  const len = queue.value.length
  if (len === 0) return -1
  if (shuffle.value) {
    if (len === 1) return currentIndex.value
    let idx = currentIndex.value
    while (idx === currentIndex.value) idx = Math.floor(Math.random() * len)
    return idx
  }
  const next = currentIndex.value + direction
  if (next < 0 || next >= len) {
    if (repeatMode.value === 'queue') return (next + len) % len
    return -1
  }
  return next
}

function playNext(auto = false) {
  if (queue.value.length === 0) return
  if (repeatMode.value === 'track' && auto) {
    if (audio.value) audio.value.currentTime = 0
    audio.value?.play().catch(() => { })
    return
  }
  const nextIndex = computeNextIndex(1)
  if (nextIndex === -1) {
    stopAudio()
    return
  }
  playAtIndex(nextIndex)
}

function playPrev() {
  if (queue.value.length === 0) return
  if (audio.value && (audio.value.currentTime || 0) > 3) {
    audio.value.currentTime = 0
    return
  }
  const prevIndex = computeNextIndex(-1)
  if (prevIndex === -1) return
  playAtIndex(prevIndex)
}

function togglePlayPause() {
  if (!audio.value) return
  if (audio.value.paused) audio.value.play()
  else audio.value.pause()
}

function onTimeUpdate() {
  if (!audio.value) return
  const a = audio.value
  duration.value = a.duration || 0
  progress.value = a.currentTime || 0
}

function onEnded() { playNext(true) }

function seek(val: number) { if (audio.value && !Number.isNaN(val)) audio.value.currentTime = val }

function setVolume(val: number) {
  if (Number.isNaN(val)) return
  volume.value = Math.min(1, Math.max(0, val))
  applyVolume()
}

function toggleMute() { isMuted.value = !isMuted.value; if (audio.value) audio.value.muted = isMuted.value }
function toggleShuffle() { shuffle.value = !shuffle.value }
function cycleRepeatMode() { repeatMode.value = repeatMode.value === 'none' ? 'track' : repeatMode.value === 'track' ? 'queue' : 'none' }

watch(currentIndex, (newIndex) => {
  if (newIndex === -1 || newIndex >= queue.value.length) {
    stopAudio()
  }
})

function handleQueueChange() {
  if (queue.value.length === 0 || currentIndex.value === -1) {
    stopAudio()
  }
}

function handleCurrentTrackRemoved(newIndex: number) {
  if (newIndex >= 0 && newIndex < queue.value.length) {
    nextTick(() => {
      playAtIndex(newIndex)
    })
  }
}

const persistKeyState = 'player.state'
const persistKeyVolume = 'player.volume'

async function persistState() {
  try {
    const state = { queue: queue.value, currentIndex: currentIndex.value, progress: progress.value, shuffle: shuffle.value, repeatMode: repeatMode.value, wasPlaying: isPlaying.value }
    localStorage.setItem(persistKeyState, JSON.stringify(state))
  } catch (_) { }
}

async function persistVolume() {
  try { localStorage.setItem(persistKeyVolume, JSON.stringify({ volume: volume.value, isMuted: isMuted.value })) } catch (_) { }
}

async function restoreState() {
  try {
    const vol = JSON.parse(localStorage.getItem(persistKeyVolume) || 'null')
    if (vol && typeof vol.volume === 'number') { volume.value = Math.min(1, Math.max(0, vol.volume)); isMuted.value = !!vol.isMuted }
    const state = JSON.parse(localStorage.getItem(persistKeyState) || 'null')
    if (state && Array.isArray(state.queue)) {
      queue.value = state.queue
      currentIndex.value = typeof state.currentIndex === 'number' ? state.currentIndex : (queue.value.length ? 0 : -1)
      shuffle.value = !!state.shuffle
      repeatMode.value = (state.repeatMode as RepeatMode) || 'none'
      nextTick(() => {
        if (!audio.value) return
        applyVolume()
        if (current.value) {
          audio.value.src = current.value.url
          const resumeAt = typeof state.progress === 'number' ? state.progress : 0
          if (!Number.isNaN(resumeAt)) audio.value.currentTime = resumeAt
          if (state.wasPlaying) audio.value.play().catch(() => { })
        }
      })
    }
  } catch (_) { }
}

onMounted(() => {
  restoreState().catch(() => { })
  window.addEventListener('beforeunload', () => { persistState().catch(() => { }) })
  addQueueChangeCallback(handleQueueChange)
  addCurrentTrackRemovedCallback(handleCurrentTrackRemoved)
})

onBeforeUnmount(() => { 
  persistState().catch(() => { })
  removeQueueChangeCallback(handleQueueChange)
  removeCurrentTrackRemovedCallback(handleCurrentTrackRemoved)
})

watch(progress, () => { persistState().catch(() => { }) })
watch([volume, isMuted], () => { persistVolume().catch(() => { }) })

export function usePlayer() {
  return {
    // elements
    audio,
    // playback state
    isPlaying,
    progress,
    duration,
    // settings
    shuffle,
    repeatMode,
    volume,
    isMuted,
    // derived
    current,
    currentIndex,
    // controls
    playAtIndex,
    playNext,
    playPrev,
    togglePlayPause,
    onTimeUpdate,
    onEnded,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    stopAudio,
    loadAndPlay,
  }
}


