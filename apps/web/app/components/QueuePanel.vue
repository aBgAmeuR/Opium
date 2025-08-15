<script setup lang="ts">
type QueueTrack = { id?: number | string; title: string; artists?: string[]; url: string; coverUrl?: string }

const props = defineProps<{
  open: boolean
  queue: QueueTrack[]
  currentIndex: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'clear'): void
  (e: 'reorder', fromIndex: number, toIndex: number): void
  (e: 'remove', index: number): void
  (e: 'playIndex', index: number): void
}>()

function onDragStart(e: DragEvent, idx: number) {
  e.dataTransfer?.setData('text/plain', String(idx))
}

function onDrop(e: DragEvent, toIndex: number) {
  const from = Number(e.dataTransfer?.getData('text/plain'))
  if (!Number.isNaN(from) && from !== toIndex) emit('reorder', from, toIndex)
}

function onKeydown(e: KeyboardEvent) {
  if (!props.open) return
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <!-- Slideover panel -->
  <Transition name="slide-in-right">
    <aside v-if="open" role="dialog" aria-modal="true" aria-label="Queue panel"
           class="fixed inset-y-0 right-0 z-50 w-[360px] md:w-[420px] border-l bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex flex-col">
      <div class="flex items-center justify-between px-3 py-2 border-b">
        <div class="text-sm font-semibold">Queue</div>
        <div class="flex items-center gap-1.5">
          <UTooltip text="Clear queue">
            <UButton icon="i-lucide-trash" color="neutral" variant="ghost" size="xs" :disabled="!props.queue.length" @click="emit('clear')" aria-label="Clear queue" />
          </UTooltip>
          <UTooltip text="Close">
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" @click="emit('close')" aria-label="Close queue" />
          </UTooltip>
        </div>
      </div>
      <div class="flex-1 overflow-y-auto p-2 pb-20">
        <div v-if="!props.queue.length" class="text-xs text-muted-foreground p-2">Queue is empty.</div>
        <ul v-else class="grid gap-1">
          <li v-for="(t,idx) in props.queue" :key="t.url" class="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/50"
              :class="{ 'bg-primary/10': idx===props.currentIndex }"
              draggable="true"
              @dragstart="(e:any)=>onDragStart(e, idx)"
              @dragover.prevent
              @drop="(e:any)=>onDrop(e, idx)">
            <span class="i-lucide-grip-vertical w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <UAvatar :src="t.coverUrl" size="xs">
              <span class="i-lucide-music w-4 h-4" aria-hidden="true" />
            </UAvatar>
            <div class="min-w-0 flex-1 cursor-pointer" @dblclick="emit('playIndex', idx)">
              <div class="truncate text-sm" :class="{ 'font-medium': idx===props.currentIndex }">{{ t.title }}</div>
              <div class="truncate text-xs text-muted-foreground">{{ (t.artists||[]).join(', ') }}</div>
            </div>
            <UTooltip text="Remove">
              <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" @click="emit('remove', idx)" aria-label="Remove from queue" />
            </UTooltip>
          </li>
        </ul>
      </div>
    </aside>
  </Transition>

  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="open" class="fixed inset-0 z-40 bg-black/40" @click="emit('close')" />
  </Transition>
</template>

<style scoped>
.slide-in-right-enter-active, .slide-in-right-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.slide-in-right-enter-from, .slide-in-right-leave-to {
  transform: translateX(100%);
  opacity: 0.8;
}
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>


