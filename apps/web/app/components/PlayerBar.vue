<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import { useQueue } from '~/composables/useQueue'
import { usePlayer } from '~/composables/usePlayer'

const { queue, current, currentIndex, isQueueOpen, toggleQueue, reorderQueue, removeFromQueue, clearQueue } = useQueue()
const { audio, isPlaying, progress, duration, shuffle, repeatMode, volume, isMuted, playAtIndex, playNext, playPrev, togglePlayPause, onTimeUpdate, onEnded, seek, setVolume, toggleMute, toggleShuffle, cycleRepeatMode } = usePlayer()

const currentArtistsText = computed(() => (current.value?.artists || [])?.join(', ') || null)
const timeElapsed = computed(() => formatTime(progress.value))
const timeRemaining = computed(() => formatTime(Math.max((duration.value || 0) - (progress.value || 0), 0)))

function formatTime(sec: number): string {
  const s = Math.floor(sec || 0)
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const r = Math.floor(s % 60).toString().padStart(2, '0')
  return `${m}:${r}`
}

function onKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement | null)?.tagName
  const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement | null)?.isContentEditable
  if (isTyping) return
  switch (e.key) {
    case ' ': e.preventDefault(); togglePlayPause(); break
    case 'ArrowRight': if (audio.value) audio.value.currentTime = Math.min((audio.value.currentTime || 0) + 5, duration.value || 0); break
    case 'ArrowLeft': if (audio.value) audio.value.currentTime = Math.max((audio.value.currentTime || 0) - 5, 0); break
    case 'ArrowUp': e.preventDefault(); volume.value = Math.min(1, volume.value + 0.05); break
    case 'ArrowDown': e.preventDefault(); volume.value = Math.max(0, volume.value - 0.05); break
  }
}

// Marquee overflow detection (local to component)
const titleEl = ref<HTMLElement | null>(null)
const shouldMarquee = ref(false)
function updateMarquee() {
  const el = titleEl.value
  if (!el) { shouldMarquee.value = false; return }
  shouldMarquee.value = el.scrollWidth > el.clientWidth + 4
}
let marqueeTimer: number | null = null
function updateMarqueeSoon() {
  if (marqueeTimer) return
  // @ts-expect-error timer typing
  marqueeTimer = setTimeout(() => { marqueeTimer = null; updateMarquee() }, 50)
}
watch(current, () => updateMarqueeSoon())

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', updateMarquee)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', updateMarquee)
})

// Expose methods for external use
function load(track: any) {
  const { load: queueLoad } = useQueue()
  queueLoad(track)
  // Start playing the loaded track
  if (currentIndex.value >= 0) {
    playAtIndex(currentIndex.value)
  }
}

function enqueue(track: any) {
  const { enqueue: queueEnqueue } = useQueue()
  queueEnqueue(track)
}

defineExpose({ load, enqueue, playNext, playPrev })
</script>

<template>
  <div class="relative">
    <!-- Queue Slideover -->
    <USlideover v-model:open="isQueueOpen" title="Queue" side="right" class="w-96">
      <template #body>
        <div v-if="queue.length === 0" class="text-center py-8 text-muted-foreground">
          <UIcon name="i-lucide-music" class="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tracks in queue</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="(track, index) in queue"
            :key="`${track.url}-${index}`"
            class="flex items-center gap-3 p-3 rounded-lg transition-colors"
            :class="[
              index === currentIndex
                ? 'bg-primary/10 border border-primary/20'
                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <!-- Track cover -->
            <UAvatar
              :src="track.coverUrl"
              size="sm"
              class="rounded-md flex-shrink-0"
            >
              <span class="i-lucide-music w-4 h-4" />
            </UAvatar>

            <!-- Track info -->
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm truncate" :title="track.title">
                {{ track.title }}
              </div>
              <div class="text-xs text-muted-foreground truncate">
                {{ track.artists?.join(', ') || 'Unknown Artist' }}
              </div>
            </div>

            <!-- Current track indicator -->
            <div v-if="index === currentIndex" class="flex items-center gap-2">
              <div class="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span class="text-xs text-primary font-medium">Now</span>
            </div>

            <!-- Track number -->
            <div v-else class="text-xs text-muted-foreground w-6 text-center">
              {{ index + 1 }}
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1">
              <UButton
                v-if="index !== currentIndex"
                color="primary"
                variant="ghost"
                size="xs"
                icon="i-lucide-play"
                @click="playAtIndex(index)"
              />
              <UButton
                color="error"
                variant="ghost"
                size="xs"
                icon="i-lucide-x"
                @click="removeFromQueue(index)"
              />
            </div>
          </div>
        </div>
      </template>

      <!-- Queue info footer -->
      <template #footer v-if="queue.length > 0">
        <div class="flex items-center justify-between text-sm text-muted-foreground">
          <span>{{ queue.length }} track{{ queue.length !== 1 ? 's' : '' }}</span>
          <span v-if="currentIndex >= 0">{{ currentIndex + 1 }} of {{ queue.length }}</span>
        </div>
      </template>
    </USlideover>

    <div class="bg-elevated/25 border-t border-default">
      <div class="px-3 py-2 flex justify-between items-center gap-x-4 gap-y-1">
        <!-- Left: Track info spans both rows -->
        <div class="col-start-1 row-span-2 self-stretch flex items-center gap-3 min-w-0">
          <UAvatar :src="current?.coverUrl || undefined" size="md" class="rounded-md">
            <span class="i-lucide-music w-5 h-5" aria-hidden="true" />
          </UAvatar>
          <div class="min-w-0">
            <Transition name="fade" mode="out-in">
              <div v-if="current" :key="current.url" ref="titleEl"
                :class="['text-sm font-medium', shouldMarquee ? 'marquee' : 'truncate']" :title="current.title">{{
                current.title }}</div>
              <div v-else key="empty" class="text-sm text-muted-foreground">Nothing playing</div>
            </Transition>
            <div class="truncate text-xs text-muted-foreground" v-if="currentArtistsText">{{ currentArtistsText }}</div>
          </div>
        </div>

        <div class="flex flex-col justify-center items-center w-2/5 max-w-md gap-1">
          <div class="col-start-2 row-start-1 flex items-center justify-center gap-2">
            <UTooltip text="Shuffle">
              <UButton :color="shuffle ? 'primary' : 'neutral'" :variant="shuffle ? 'soft' : 'ghost'"
                icon="i-lucide-shuffle" size="sm" @click="toggleShuffle" aria-label="Shuffle" />
            </UTooltip>
            <UTooltip text="Previous">
              <UButton icon="i-lucide-skip-back" color="neutral" variant="ghost" size="sm" @click="playPrev"
                aria-label="Previous" />
            </UTooltip>
            <UTooltip :text="isPlaying ? 'Pause' : 'Play'">
              <UButton v-if="!isPlaying" icon="i-lucide-play" color="primary" variant="soft" size="md"
                @click="togglePlayPause" aria-label="Play" />
              <UButton v-else icon="i-lucide-pause" color="primary" variant="soft" size="md" @click="togglePlayPause"
                aria-label="Pause" />
            </UTooltip>
            <UTooltip text="Next">
              <UButton icon="i-lucide-skip-forward" color="neutral" variant="ghost" size="sm"
                @click="() => playNext(false)" aria-label="Next" />
            </UTooltip>
            <UTooltip
              :text="repeatMode === 'none' ? 'Repeat off' : repeatMode === 'track' ? 'Repeat track' : 'Repeat queue'">
              <UButton :icon="repeatMode === 'queue' ? 'i-lucide-repeat' : 'i-lucide-repeat-1'"
                :color="repeatMode === 'none' ? 'neutral' : 'primary'" :variant="repeatMode === 'none' ? 'ghost' : 'soft'"
                size="sm" @click="cycleRepeatMode" aria-label="Repeat" />
            </UTooltip>
          </div>

          <div class="col-start-2 row-start-2 w-full">
            <div class="mx-auto flex items-center gap-3 w-full">
              <span class="text-[11px] md:text-xs tabular-nums text-muted-foreground">{{ timeElapsed }}</span>
              <USlider v-model="progress" size="xs" :min="0" :max="duration || 0" :step="1" @update:model-value="val => seek(val as number)" />
              <span class="text-[11px] md:text-xs tabular-nums text-muted-foreground">-{{ timeRemaining }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Volume and queue spans both rows -->
        <div class="col-start-3 row-span-2 self-stretch flex items-center justify-end gap-2">
          <UTooltip text="Queue">
            <UButton icon="i-lucide-list-music" :color="isQueueOpen ? 'primary' : 'neutral'"
              :variant="isQueueOpen ? 'soft' : 'ghost'" size="sm" @click="toggleQueue()" aria-label="Toggle queue" />
          </UTooltip>
          <div class="flex items-center gap-2">
            <UTooltip :text="isMuted || volume === 0 ? 'Unmute' : 'Mute'">
              <UButton
                :icon="isMuted || volume === 0 ? 'i-lucide-volume-x' : (volume < 0.5 ? 'i-lucide-volume-1' : 'i-lucide-volume-2')"
                color="neutral" variant="ghost" size="sm" @click="toggleMute" aria-label="Mute" />
            </UTooltip>
            <USlider v-model="volume" size="xs" :min="0" :max="1" :step="0.01" @update:model-value="val => setVolume(val as number)"
              class="w-20" />
          </div>
        </div>

        <!-- Bottom center: compact progress (second row) -->

      </div>

      <audio ref="audio" @play="isPlaying = true" @pause="isPlaying = false" @timeupdate="onTimeUpdate" @ended="onEnded" />
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  white-space: nowrap;
  display: block;
  position: relative;
}

.marquee::after {
  content: attr(title);
}

.marquee {
  animation: marquee 12s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-20%);
  }
}
</style>
