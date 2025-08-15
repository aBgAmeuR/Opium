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

const instance = getCurrentInstance()
const hasPro = computed(() => !!instance?.appContext.components?.USlideover)

function onDragStart(e: DragEvent, idx: number) {
  e.dataTransfer?.setData('text/plain', String(idx))
}
function onDrop(e: DragEvent, toIndex: number) {
  const from = Number(e.dataTransfer?.getData('text/plain'))
  if (!Number.isNaN(from) && from !== toIndex) emit('reorder', from, toIndex)
}
</script>

<template>
  <!-- Prefer Nuxt UI Pro USlideover when available; fallback to basic QueuePanel -->
  <component
    v-if="hasPro"
    :is="'USlideover'"
    :open="props.open"
    side="right"
    overlay
    @update:open="(v:any)=>{ if (!v) emit('close') }"
  >
    <template #header>
      <div class="flex items-center justify-between px-3 py-2">
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
    </template>
    <div class="p-2">
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
  </component>

  <QueuePanel v-else :open="props.open" :queue="props.queue" :currentIndex="props.currentIndex" @close="emit('close')" @clear="emit('clear')" @reorder="emit('reorder', $event[0], $event[1])" @remove="emit('remove', $event)" @playIndex="emit('playIndex', $event)" />
</template>



