<script setup lang="ts">
import type { QueueTrack } from '~/composables/useQueue'
import type { DropdownMenuItem } from '@nuxt/ui'

interface Props {
  track: {
    id: number
    title: string
    artists: string[]
    versions: Array<{
      id: number
      title: string
      artists: string[]
      fileUrl: string
    }>
    album?: {
      coverUrl: string
    } | null
  }
}

const props = defineProps<Props>()

const { loadAndPlay } = usePlayer()
const { load: addToQueue, playNext: addToPlayNext } = useQueue()

const playTrack = () => {
  console.log('Play track clicked:', props.track.title)
  const firstVersion = props.track.versions[0]
  if (!firstVersion) return
  
  const queueTrack: QueueTrack = {
    id: firstVersion.id,
    title: firstVersion.title,
    artists: firstVersion.artists,
    url: firstVersion.fileUrl,
    coverUrl: props.track.album?.coverUrl
  }
  
  loadAndPlay(queueTrack)
}

const playNext = () => {
  console.log('Play next clicked:', props.track.title)
  const firstVersion = props.track.versions[0]
  if (!firstVersion) return
  
  const queueTrack: QueueTrack = {
    id: firstVersion.id,
    title: firstVersion.title,
    artists: firstVersion.artists,
    url: firstVersion.fileUrl,
    coverUrl: props.track.album?.coverUrl
  }
  
  addToPlayNext(queueTrack)
}

const addToQueueTrack = () => {
  console.log('Add to queue clicked:', props.track.title)
  const firstVersion = props.track.versions[0]
  if (!firstVersion) return
  
  const queueTrack: QueueTrack = {
    id: firstVersion.id,
    title: firstVersion.title,
    artists: firstVersion.artists,
    url: firstVersion.fileUrl,
    coverUrl: props.track.album?.coverUrl
  }
  
  addToQueue(queueTrack)
}

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Play',
      icon: 'i-lucide-play',
      onSelect: playTrack
    },
    {
      label: 'Play Next',
      icon: 'i-lucide-skip-forward',
      onSelect: playNext
    }
  ],
  [
    {
      label: 'Add to Queue',
      icon: 'i-lucide-plus',
      onSelect: addToQueueTrack
    },
    {
      label: 'Add to Playlist',
      icon: 'i-lucide-list-music',
      disabled: true
    }
  ]
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      icon="i-lucide-ellipsis-vertical"
      color="neutral"
      variant="ghost"
      size="sm"
      aria-label="Actions dropdown"
    />
  </UDropdownMenu>
</template>