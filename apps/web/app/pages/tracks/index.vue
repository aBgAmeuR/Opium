<script setup lang="ts">
import { h } from 'vue'
import TrackVersionsRow from '~/components/TrackVersionsRow.vue'
import type { TableColumn } from '#ui/types'
import { UBadge, UButton } from '#components'
import TrackActionsDropdown from '~/components/TrackActionsDropdown.vue'

const { $orpc } = useNuxtApp()
const { loadAndPlay } = usePlayer()

const search = ref('')
const sortBy = ref<'createdAt' | 'title' | 'albumTitle'>('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')

const versions = [
  'official',
  'remix',
  'performance',
  'remastered',
  'remastered AI',
  'AI',
  'fan made',
  'feature',
  'leak',
  'other',
] as const
const versionType = ref<'all' | typeof versions[number]>('all')

const { data: tracks, isPending, error, refetch } = useQuery(
  computed(() =>
    $orpc.tracks.list.queryOptions({
      input: {
        query: search.value || undefined,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
        versionType: versionType.value === 'all' ? undefined : versionType.value,
        limit: 100,
        offset: 0,
      },
    }),
  ),
)

type TrackRow = Awaited<ReturnType<typeof $orpc.tracks.list.call>>['items'][number]

const rows = computed<TrackRow[]>(() => tracks.value?.items ?? [])

const playTrack = (track: TrackRow) => {
  const firstVersion = track.versions[0]
  if (!firstVersion) return
  
  loadAndPlay({
    id: firstVersion.id,
    title: firstVersion.title,
    artists: firstVersion.artists,
    url: firstVersion.fileUrl,
    coverUrl: track.album?.coverUrl
  })
}

const columns: TableColumn<TrackRow>[] = [
  {
    id: 'expand',
    meta: { class: { td: 'w-4 px-0' } },
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        size: 'sm',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : ''
          ]
        },
        onClick: () => row.toggleExpanded()
      })
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const album = row.original.album
      const coverUrl = album && album.coverUrl
      const alternateTitles = row.original.alternateTitles ?? []
      return h(
        'div',
        { class: 'flex items-center gap-3 font-medium' },
        [
          coverUrl
            ? h('img', {
              src: coverUrl,
              alt: 'cover',
              class: 'size-8 rounded object-cover',
              style: 'min-width:2rem;min-height:2rem;',
            })
            : h('div', {
              class: 'size-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400',
              style: 'min-width:2rem;min-height:2rem;',
            }, '—'),
          h('div', {}, [
            h('div', { class: 'font-medium text-highlighted' }, row.original.versions[0]?.title ?? ''),
            alternateTitles.length > 0 && h('div', { class: 'text-xs text-muted-foreground' }, `Also: ${alternateTitles.slice(0, 2).join(', ')}`),
          ]),
        ]
      )
    },
  },
  {
    accessorKey: 'artistsCsv',
    header: 'Artists',
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.original.versions[0]?.artists.join(', ') ?? ''),
  },
  {
    accessorKey: 'album.title',
    header: 'Album',
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.original.album.title),
  },
  {
    accessorKey: 'versions.type',
    header: 'Type',
    cell: ({ row }) => h(UBadge, { color: 'neutral', variant: 'outline' }, row.original.versions[0]?.type ?? ''),
  },
  {
    accessorKey: 'actions',
    header: '',
    meta: { class: { td: 'w-16 p-0' } },
    cell: ({ row }) => h('div', { class: 'text-right' }, [
      h(UButton, { 
        color: 'neutral', 
        variant: 'ghost', 
        icon: 'i-lucide-play', 
        size: 'sm',
        onClick: () => playTrack(row.original)
      }),
      h(TrackActionsDropdown, { track: row.original })
    ])
  }
]
</script>

<template>
  <UDashboardPanel id="tracks" class="min-h-auto">
    <template #header>
      <UDashboardNavbar title="Tracks" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UColorModeButton />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <div class="flex items-center gap-2">
            <UInput v-model="search" placeholder="Search by title or artist" @change="refetch()" />
            <USelect v-model="sortBy"
              :items="[{ label: 'Title', value: 'title' }, { label: 'Album', value: 'albumTitle' }, { label: 'Created', value: 'createdAt' }]" />
            <USelect v-model="sortDir" :items="[{ label: 'Asc', value: 'asc' }, { label: 'Desc', value: 'desc' }]" />
            <USelect v-model="versionType"
              :items="[{ label: 'All', value: 'all' }, ...versions.map(v => ({ label: v.charAt(0).toUpperCase() + v.slice(1), value: v }))]"
              class="w-40" />
          </div>
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <UAlert v-if="error" color="error" icon="i-lucide-alert-triangle" title="Failed to load tracks"
        :description="String(error)" class="mb-4" />
      <UTable :data="rows" :columns="columns" :loading="isPending" loading-animation="carousel"
        :empty-state="{ icon: 'i-lucide-search', label: 'No tracks found' }" :ui="{ td: 'p-2', th: 'p-2' }">
        <template #expanded="{ row }">
          <TrackVersionsRow :versions="row.original.versions" :album="row.original.album" />
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>