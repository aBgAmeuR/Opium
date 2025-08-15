import { computed, ref } from 'vue'

export type QueueTrack = { id?: number | string; title: string; artists?: string[]; url: string; coverUrl?: string }

// Module-scoped singletons so all consumers share the same state
const queue = ref<QueueTrack[]>([])
const currentIndex = ref<number>(-1)
const isQueueOpen = ref(false)

// Callbacks for external components to react to queue changes
const onQueueChangeCallbacks = ref<Array<() => void>>([])
const onCurrentTrackRemovedCallbacks = ref<Array<(newIndex: number) => void>>([])

const current = computed(() => queue.value[currentIndex.value] ?? null)

function addQueueChangeCallback(callback: () => void) {
  onQueueChangeCallbacks.value.push(callback)
}

function removeQueueChangeCallback(callback: () => void) {
  const index = onQueueChangeCallbacks.value.indexOf(callback)
  if (index > -1) {
    onQueueChangeCallbacks.value.splice(index, 1)
  }
}

function addCurrentTrackRemovedCallback(callback: (newIndex: number) => void) {
  onCurrentTrackRemovedCallbacks.value.push(callback)
}

function removeCurrentTrackRemovedCallback(callback: (newIndex: number) => void) {
  const index = onCurrentTrackRemovedCallbacks.value.indexOf(callback)
  if (index > -1) {
    onCurrentTrackRemovedCallbacks.value.splice(index, 1)
  }
}

function notifyQueueChange() {
  onQueueChangeCallbacks.value.forEach(callback => callback())
}

function notifyCurrentTrackRemoved(newIndex: number) {
  onCurrentTrackRemovedCallbacks.value.forEach(callback => callback(newIndex))
}

function toggleQueue() {
  isQueueOpen.value = !isQueueOpen.value
}

function setQueueOpen(open: boolean) {
  isQueueOpen.value = !!open
}

function enqueue(track: QueueTrack) {
  if (!queue.value.some((t) => t.url === track.url)) queue.value.push(track)
  notifyQueueChange()
}

function load(track: QueueTrack) {
  const existingIndex = queue.value.findIndex((t) => t.url === track.url)
  if (existingIndex >= 0) {
    currentIndex.value = existingIndex
  } else {
    queue.value.push(track)
    currentIndex.value = queue.value.length - 1
  }
  notifyQueueChange()
}

function reorderQueue(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return
  if (fromIndex < 0 || toIndex < 0) return
  if (fromIndex >= queue.value.length || toIndex >= queue.value.length) return
  const items = [...queue.value]
  const moved = items.splice(fromIndex, 1)[0]
  if (!moved) return
  items.splice(toIndex, 0, moved)
  queue.value = items
  if (currentIndex.value === fromIndex) currentIndex.value = toIndex
  else if (fromIndex < currentIndex.value && toIndex >= currentIndex.value) currentIndex.value = currentIndex.value - 1
  else if (fromIndex > currentIndex.value && toIndex <= currentIndex.value) currentIndex.value = currentIndex.value + 1
  notifyQueueChange()
}

function removeFromQueue(index: number) {
  const wasCurrent = index === currentIndex.value
  queue.value.splice(index, 1)
  
  if (queue.value.length === 0) {
    // Queue is empty, reset everything
    currentIndex.value = -1
  } else if (wasCurrent) {
    // We removed the current track, need to select a new one
    if (index >= queue.value.length) {
      // We were at the end, go to the last remaining track
      currentIndex.value = queue.value.length - 1
    } else {
      // We were in the middle, stay at the same position (which now points to the next track)
      currentIndex.value = index
    }
  } else if (index < currentIndex.value) {
    // We removed a track before the current one, adjust the index
    currentIndex.value = currentIndex.value - 1
  }
  // If we removed a track after the current one, no index adjustment needed
  
  notifyQueueChange()
  notifyCurrentTrackRemoved(currentIndex.value)
}

function clearQueue() {
  queue.value = []
  currentIndex.value = -1
  notifyQueueChange()
}

export function useQueue() {
  return {
    // state
    queue,
    currentIndex,
    isQueueOpen,
    current,
    // actions
    toggleQueue,
    setQueueOpen,
    enqueue,
    load,
    reorderQueue,
    removeFromQueue,
    clearQueue,
    // callbacks
    addQueueChangeCallback,
    removeQueueChangeCallback,
    addCurrentTrackRemovedCallback,
    removeCurrentTrackRemovedCallback,
  }
}


