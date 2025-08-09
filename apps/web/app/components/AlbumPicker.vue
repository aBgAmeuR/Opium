<script setup lang="ts">
import { useQuery, useMutation } from '@tanstack/vue-query'

const props = defineProps<{
  modelValue: number | null
  open: boolean
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', id: number | null): void
  (e: 'update:open', open: boolean): void
}>()

const isOpen = computed({
  get: () => props.open,
  set: (val: boolean) => emits('update:open', val),
})

const { $orpc } = useNuxtApp()
const search = ref('')

const listOptions = computed(() =>
  $orpc.albums.list.queryOptions({ input: { query: search.value || undefined, limit: 100, offset: 0 } }),
)
const list = useQuery(listOptions)

const createAlbum = useMutation(
  $orpc.albums.create.mutationOptions({
    onSuccess: () => list.refetch(),
  }),
)

const newAlbum = reactive({ title: '', coverUrl: '' })

const onPick = (id: number) => {
  emits('update:modelValue', id)
  emits('update:open', false)
}

const onCreate = async () => {
  if (!newAlbum.title || !newAlbum.coverUrl) return
  const res = await createAlbum.mutateAsync({ title: newAlbum.title, coverUrl: newAlbum.coverUrl })
  emits('update:modelValue', res?.id ?? null)
  emits('update:open', false)
}
</script>

<template>
  <UModal v-model:open="isOpen">
    <template #content>
      <UCard>
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-medium">Select Album</h3>
          <div class="flex items-center gap-2">
            <UInput v-model="search" placeholder="Search albums" class="w-48" />
            <UButton color="neutral" variant="ghost" icon="i-lucide-x" aria-label="Close" @click="isOpen = false" />
          </div>
        </div>
        <div v-if="list.isPending.value" class="p-4 text-sm text-muted-foreground">Loading...</div>
        <div v-else class="grid gap-2 max-h-80 overflow-y-auto">
          <button v-for="album in list.data.value || []" :key="album.id"
            class="flex items-center gap-3 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
            @click="onPick(album.id)">
            <img :src="album.coverUrl" alt="cover" class="w-10 h-10 rounded object-cover" />
            <span>{{ album.title }}</span>
          </button>
          <div v-if="(list.data.value || []).length === 0" class="text-sm text-muted-foreground">No albums yet.</div>
        </div>

        <div class="mt-4 border-t pt-3">
          <h4 class="font-medium mb-2">Create new album</h4>
          <div class="flex gap-2">
            <UInput v-model="newAlbum.title" placeholder="Title" />
            <UInput v-model="newAlbum.coverUrl" placeholder="Cover URL" />
            <UButton @click="onCreate">Create</UButton>
          </div>
        </div>
      </UCard>
    </template>
  </UModal>
</template>
