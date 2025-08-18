<script setup lang="ts">
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({ middleware: ['auth', 'admin'] })

const { $orpc } = useNuxtApp()

const versionTypes = ["official", "remix", "performance", "remastered", "remastered AI", "AI", "fan made", "feature", "leak", "other"] as const
type VersionType = (typeof versionTypes)[number]

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  artistsInput: z.string().optional(),
  producersInput: z.string().optional(),
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

type Schema = zInfer<typeof schema>

type State = {
  title: string
  artistsInput?: string
  producersInput?: string
  albumId?: number
  alternateTitlesInput?: string
  versions: Array<{ type: VersionType; title: string; fileUrl: string; artistsInput?: string }>
}

const form = reactive<State>({
  title: '',
  artistsInput: 'Playboi Carti',
  producersInput: '',
  albumId: undefined,
  alternateTitlesInput: '',
  versions: [{ type: versionTypes[0], title: '', fileUrl: '', artistsInput: 'Playboi Carti' }],
})

const addVersion = () => {
  form.versions.push({ type: versionTypes[0], title: '', fileUrl: '', artistsInput: 'Playboi Carti' })
}

const removeVersion = (idx: number) => {
  form.versions.splice(idx, 1)
}

const queryClient = useQueryClient()
type CreateTrackInput = { title: string; artists: string[]; producers: string[]; albumId: number; versions: Array<{ type: VersionType; title: string; fileUrl: string; artists: string[] }>; alternateTitles?: string[] }
const createTrack = useMutation(
  $orpc.tracks.create.mutationOptions({
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: $orpc.tracks.list.key() })
      navigateTo(`/admin/tracks/${res?.id}`)
    },
  }),
)

const albumOpen = ref(false)
const albumIdProxy = computed<number | null>({
  get: () => form.albumId ?? null,
  set: (val) => { form.albumId = val ?? undefined },
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const payload: CreateTrackInput = {
    title: event.data.title,
    artists: (event.data.artistsInput ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    producers: (event.data.producersInput ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
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
  <UDashboardPanel id="new-track" class="min-h-auto">
    <template #header>
      <UDashboardNavbar title="New Track" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UCard>
      <UForm :schema="schema" :state="form" @submit="onSubmit" class="grid gap-4">
        <div class="grid md:grid-cols-2 gap-3">
          <UFormField label="Title" name="title" required>
            <UInput v-model="form.title" placeholder="Track title" class="w-full" />
          </UFormField>
          <UFormField label="Alternate Titles (comma separated)" name="alternateTitlesInput">
            <UInput v-model="form.alternateTitlesInput" placeholder="e.g. Whole Lotta Red, WLR" class="w-full" />
          </UFormField>

        </div>
        <div class="grid md:grid-cols-2 gap-3">
          <UFormField label="Artists (comma separated)" name="artistsInput" required>
            <UInput v-model="form.artistsInput" placeholder="e.g. Playboi Carti, Lil Uzi Vert" class="w-full" />
          </UFormField>
          <UFormField label="Producers (comma separated)" name="producersInput">
            <UInput v-model="form.producersInput" placeholder="e.g. Pi'erre Bourne" class="w-full" />
          </UFormField>
        </div>
        <UFormField label="Album" name="albumId" required>
          <div class="flex gap-2 items-center">
            <UButton variant="soft" icon="i-lucide-disc" @click="albumOpen = true">Select Album</UButton>
            <span v-if="form.albumId" class="text-sm text-muted-foreground">Selected ID: {{ form.albumId }}</span>
          </div>
        </UFormField>


        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="font-medium">Versions</h3>
            <UButton size="xs" icon="i-lucide-plus" variant="soft" @click="addVersion">Add Version</UButton>
          </div>
          <div class="grid gap-2">
            <div v-for="(v, idx) in form.versions" :key="idx" class="flex gap-2 items-center">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2 items-center flex-1">
                <UFormField :name="`versions.${idx}.type`" :error="false" required>
                  <USelect v-model="v.type"
                    :items="versionTypes.map(v => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }))"
                    placeholder="Select version type" class="w-full" />
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
              </div>
              <div class="col-span-3 flex justify-end">
                <UButton color="error" icon="i-lucide-trash" variant="soft" @click="removeVersion(idx)" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-2">
          <NuxtLink to="/admin/tracks">
            <UButton variant="soft">Cancel</UButton>
          </NuxtLink>
          <UButton :loading="createTrack.status.value === 'pending'" type="submit">Create</UButton>
        </div>
      </UForm>
    </UCard>
    <AlbumPicker v-model="albumIdProxy" v-model:open="albumOpen" />
    </template>
  </UDashboardPanel>
</template>

