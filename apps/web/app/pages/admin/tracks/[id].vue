<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import AlbumPicker from '~/components/AlbumPicker.vue'

definePageMeta({ middleware: ['auth','admin'] })

const route = useRoute()
const id = Number(route.params.id)

const { $orpc } = useNuxtApp()

const versionTypes = ["official", "remix", "performance", "remastered", "remastered AI", "AI", "fan made", "feature", "leak", "other"] as const
type VersionType = (typeof versionTypes)[number]

const trackQuery = useQuery({
  queryKey: ['tracks', 'byId', id],
  queryFn: () => $orpc.tracks.byId.call({ id }),
})
const qc = useQueryClient()

const updateTrack = useMutation({
  mutationFn: (input: { albumId: number; alternateTitlesInput: string }) =>
    $orpc.tracks.update.call({
      id: Number(id),
      albumId: input.albumId,
      alternateTitles: input.alternateTitlesInput.split(',').map(s=>s.trim()).filter(Boolean),
    }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks', 'byId', id] }),
})

const deleteTrack = useMutation({
  mutationFn: () => $orpc.tracks.remove.call({ id: Number(id) }),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ['tracks', 'list'] })
    navigateTo('/admin/tracks')
    },
})
const addVersion = useMutation({
  mutationFn: (input: { type: VersionType; title: string; fileUrl: string }) => $orpc.tracks.addVersion.call({ trackId: id, ...input }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks', 'byId', id] }),
})

const updateVersion = useMutation({
  mutationFn: (input: { id: number; type: VersionType; title: string; fileUrl: string }) => $orpc.tracks.updateVersion.call(input),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks', 'byId', id] }),
})

const removeVersion = useMutation({
  mutationFn: (versionId: number) => $orpc.tracks.removeVersion.call({ id: versionId }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks', 'byId', id] }),
})

const reorderVersions = useMutation({
  mutationFn: (orderedIds: number[]) => $orpc.tracks.reorderVersions.call({ trackId: id, orderedIds }),
  onSuccess: () => qc.invalidateQueries({ queryKey: ['tracks', 'byId', id] }),
})

const local = reactive({
  albumId: null as number | null,
  alternateTitlesInput: '',
})

watchEffect(() => {
  const t = trackQuery.data.value
  if (!t) return
  local.albumId = t.albumId ?? null
  local.alternateTitlesInput = (t.alternateTitles || []).join(', ')
})

const onSave = async () => {
  await updateTrack.mutateAsync({ albumId: local.albumId!, alternateTitlesInput: local.alternateTitlesInput })
}

const onDelete = async () => {
  if (!confirm('Delete this track?')) return
  await deleteTrack.mutateAsync()
}

const newVersion = reactive({ type: versionTypes[0], title: '', fileUrl: '' })
const addVersionNow = async () => {
  await addVersion.mutateAsync({ type: newVersion.type, title: newVersion.title, fileUrl: newVersion.fileUrl })
  newVersion.type = versionTypes[0]
  newVersion.title = ''
}

// Simple drag and drop reorder using HTML5 API
const draggingId = ref<number | null>(null)
const onDragStart = (id: number) => { draggingId.value = id }
const onDragOver = (e: DragEvent) => { e.preventDefault() }
const onDrop = (id: number) => {
  const versions = trackQuery.data.value?.versions || []
  const ids = versions.map((v: { id: number }) => v.id)
  const from = ids.indexOf(draggingId.value!)
  const to = ids.indexOf(id)
  if (from < 0 || to < 0) return
  ids.splice(to, 0, ids.splice(from, 1)[0]!)
  reorderVersions.mutate(ids)
  draggingId.value = null
}
</script>

<template>
  <div class="container mx-auto p-4" v-if="trackQuery.data.value">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Edit Track</h1>
      <div class="flex gap-2">
        <UButton color="error" variant="soft" icon="i-lucide-trash" @click="onDelete">Delete</UButton>
        <UButton icon="i-lucide-save" @click="onSave" :loading="updateTrack.status.value === 'pending'">Save</UButton>
      </div>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <UCard>
        <div class="grid gap-3">
          <UFormGroup label="Album">
            <div class="flex gap-2 items-center">
              <UButton variant="soft" icon="i-lucide-disc" @click="albumOpen = true">Select Album</UButton>
              <span v-if="local.albumId" class="text-sm text-muted-foreground">Selected ID: {{ local.albumId }}</span>
            </div>
          </UFormGroup>
          <UFormGroup label="Alternate Titles (comma separated)">
            <UInput v-model="local.alternateTitlesInput" />
          </UFormGroup>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium">Versions</h3>
          <div class="flex gap-2 items-center">
            <USelect v-model="newVersion.type" :items="versionTypes.map(v => ({label:v, value:v}))" />
            <UInput v-model="newVersion.title" placeholder="Optional title" />
            <UButton size="xs" icon="i-lucide-plus" variant="soft" @click="addVersionNow">Add</UButton>
          </div>
        </div>

        <ul class="grid gap-2">
          <li v-for="v in trackQuery.data.value.versions" :key="v.id"
              draggable
              @dragstart="onDragStart(v.id)"
              @dragover.prevent="onDragOver"
              @drop="onDrop(v.id)"
              class="flex items-center gap-2 p-2 border rounded">
            <span class="cursor-move i-lucide-grip-vertical" />
            <USelect v-model="v.type" :items="versionTypes.map(v => ({label:v, value:v}))" @change="updateVersion.mutate({ id: v.id, type: v.type, title: v.title, fileUrl: v.fileUrl })" />
            <UInput v-model="v.title" placeholder="Title" @change="updateVersion.mutate({ id: v.id, type: v.type, title: v.title, fileUrl: v.fileUrl })" />
            <UButton size="xs" color="warning" variant="soft" icon="i-lucide-trash" @click="removeVersion.mutate(v.id)" />
          </li>
        </ul>
      </UCard>
    </div>
    <AlbumPicker v-model="local.albumId" v-model:open="albumOpen" />
  </div>
  <div v-else class="p-4">Loading...</div>
</template>

<script lang="ts">
export default { data: () => ({ albumOpen: false }) }
</script>


