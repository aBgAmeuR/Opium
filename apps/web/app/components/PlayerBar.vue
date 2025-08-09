<script setup lang="ts">
const audio = ref<HTMLAudioElement | null>(null)

const current = reactive({
  title: '',
  artists: '' as string | null,
  url: ''
})

const isPlaying = ref(false)
const progress = ref(0)
const duration = ref(0)

function load(track: { title: string; artists?: string[]; url: string }) {
  current.title = track.title
  current.artists = (track.artists || [])?.join(', ') || null
  current.url = track.url
  nextTick(() => {
    if (audio.value) {
      audio.value.src = current.url
      audio.value.play().catch(() => {})
    }
  })
}

function toggle() {
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

function seek(e: Event) {
  const target = e.target as HTMLInputElement
  const val = Number(target.value)
  if (audio.value && !Number.isNaN(val)) {
    audio.value.currentTime = val
  }
}

defineExpose({ load })
</script>

<template>
  <div class="h-14 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3">
    <button class="i-lucide-play w-6 h-6" v-if="!isPlaying" @click="toggle" aria-label="Play" />
    <button class="i-lucide-pause w-6 h-6" v-else @click="toggle" aria-label="Pause" />
    <div class="min-w-0">
      <div class="truncate text-sm font-medium">{{ current.title || 'Nothing playing' }}</div>
      <div class="truncate text-xs text-muted-foreground" v-if="current.artists">{{ current.artists }}</div>
    </div>
    <div class="flex items-center gap-2 w-1/2">
      <span class="text-xs tabular-nums">{{ Math.floor(progress/60).toString().padStart(2,'0') }}:{{ Math.floor(progress%60).toString().padStart(2,'0') }}</span>
      <input class="w-full" type="range" min="0" :max="duration || 0" :value="progress" @input="seek" />
      <span class="text-xs tabular-nums">{{ Math.floor(duration/60).toString().padStart(2,'0') }}:{{ Math.floor(duration%60).toString().padStart(2,'0') }}</span>
    </div>
    <audio ref="audio" @play="isPlaying=true" @pause="isPlaying=false" @timeupdate="onTimeUpdate" />
  </div>
</template>


