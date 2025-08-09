<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { FormSubmitEvent } from '#ui/types'
import z from 'zod'
import AlbumPicker from '~/components/AlbumPicker.vue'

definePageMeta({ middleware: ['auth','admin'] })

const { $orpc } = useNuxtApp()

const versionTypes = ["official", "remix", "performance", "remastered", "remastered AI", "AI", "fan made", "feature", "leak", "other"] as const
type VersionType = (typeof versionTypes)[number]

const schema = z.object({
  albumId: z.number().int().gt(0, 'Select an album'),
  alternateTitlesInput: z.string().optional(),
  versions: z
    .array(
      z.object({
        type: z
          .string()
          .refine(v => versionTypes.includes(v as VersionType), 'Invalid version type'),
        title: z.string().min(1, 'Title is required'),
        fileUrl: z.string(),
        artistsInput: z.string().optional(),
      })
    )
    .min(1, 'Add at least one version'),
})

type Schema = z.output<typeof schema>

type State = {
  albumId?: number
  alternateTitlesInput?: string
  versions: Array<{ type: VersionType; title: string; fileUrl: string; artistsInput?: string }>
}

const form = reactive<State>({
  albumId: undefined,
  alternateTitlesInput: '', 
  versions: [],
})

const addVersion = () => {
  form.versions.push({ type: versionTypes[0], title: '', fileUrl: '', artistsInput: 'Playboi Carti' })
}

const removeVersion = (idx: number) => {
  form.versions.splice(idx, 1)
}

const queryClient = useQueryClient()
type CreateTrackInput = { albumId: number; versions: Array<{ type: VersionType; title: string; fileUrl: string; artists: string[] }>; alternateTitles?: string[] }
const createTrack = useMutation({
  mutationFn: (payload: CreateTrackInput) =>
    $orpc.tracks.create.call(payload),
  onSuccess: (res) => {
    queryClient.invalidateQueries({ queryKey: ['tracks', 'list'] })
    navigateTo(`/admin/tracks/${res?.id}`)
  },
})

const albumOpen = ref(false)
const albumIdProxy = computed<number | null>({
  get: () => form.albumId ?? null,
  set: (val) => { form.albumId = val ?? undefined },
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  const payload: CreateTrackInput = {
    albumId: event.data.albumId,
    alternateTitles: (event.data.alternateTitlesInput ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    versions: event.data.versions.map(v => ({
      type: v.type as VersionType,
      title: v.title,
      fileUrl: v.fileUrl,
      artists: (v.artistsInput ?? '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
    })),
  }
  await createTrack.mutateAsync(payload)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">New Track</h1>
    </div>

    <UCard>
      <UForm :schema="schema" :state="form" @submit="onSubmit" class="grid gap-4">
        <UFormField label="Album" name="albumId" required>
          <div class="flex gap-2 items-center">
            <UButton variant="soft" icon="i-lucide-disc" @click="albumOpen = true">Select Album</UButton>
            <span v-if="form.albumId" class="text-sm text-muted-foreground">Selected ID: {{ form.albumId }}</span>
          </div>
        </UFormField>
        <UFormField label="Alternate Titles (comma separated)" name="alternateTitlesInput" required>
          <UInput v-model="form.alternateTitlesInput" placeholder="e.g. Whole Lotta Red, WLR" />
        </UFormField>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium">Versions</h3>
            <UButton size="xs" icon="i-lucide-plus" variant="soft" @click="addVersion">Add Version</UButton>
          </div>
          <div class="grid gap-2">
            <div v-for="(v, idx) in form.versions" :key="idx" class="grid grid-cols-4 gap-2 items-center">
              <UFormField :name="`versions.${idx}.type`" :error="false" required>
                <USelect v-model="v.type" :items="versionTypes.map(v => ({label: v.charAt(0).toUpperCase() + v.slice(1), value:v}))" placeholder="Select version type" class="w-full" />
              </UFormField> 
              <UFormField :name="`versions.${idx}.title`" :error="false" required>
                <UInput v-model="v.title" placeholder="Title" class="w-full" />
              </UFormField>
              <UFormField :name="`versions.${idx}.artistsInput`" :error="false" required>
                <UInput v-model="v.artistsInput" placeholder="Artists (comma separated)" class="w-full" />
              </UFormField>
              <UFormField :name="`versions.${idx}.fileUrl`" :error="false" required>
                <UInput v-model="v.fileUrl" placeholder="File URL" class="w-full" />
              </UFormField>
              <div class="col-span-3 flex justify-end">
                <UButton color="error" icon="i-lucide-trash" variant="soft" @click="removeVersion(idx)" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <NuxtLink to="/admin/tracks"><UButton variant="soft">Cancel</UButton></NuxtLink>
          <UButton :loading="createTrack.status.value === 'pending'" type="submit">Create</UButton>
        </div>
      </UForm>
    </UCard>
    <AlbumPicker v-model="albumIdProxy" v-model:open="albumOpen" />
  </div>
</template>

