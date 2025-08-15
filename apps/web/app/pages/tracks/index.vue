<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import TrackVersionsRow from '~/components/TrackVersionsRow.vue'
import type { TableColumn } from '#ui/types'

const { $orpc } = useNuxtApp()

const search = ref('')
const sortBy = ref<'createdAt' | 'title'>('createdAt')
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

type TrackRow = {
  id: number
  title: string
  artistsCsv: string
  createdAt: string | Date
  album: { coverUrl?: string; title?: string } | null
  versions: Array<{ id: number; type: string; title: string; artists: string[]; fileUrl?: string }>
}

const rows = computed<TrackRow[]>(() =>
  (tracks.value?.items ?? []).map((t) => ({
    id: t.id,
    title: t.title ?? 'untitled',
    artistsCsv: Array.isArray(t.artists) ? t.artists.join(', ') : '',
    createdAt: t.createdAt,
    album: t.album,
    versions: t.versions,
  })),
)

const columns: TableColumn<TrackRow>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      const album = row.original.album
      const coverUrl = album && album.coverUrl
      return h(
        'div',
        { class: 'flex items-center gap-3 font-medium' },
        [
          coverUrl
            ? h('img', {
                src: coverUrl,
                alt: 'cover',
                class: 'w-8 h-8 rounded object-cover',
                style: 'min-width:2rem;min-height:2rem;',
              })
            : h('div', {
                class: 'w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-400',
                style: 'min-width:2rem;min-height:2rem;',
              }, '—'),
          h('span', {}, row.getValue('title')),
        ]
      )
    },
  },
  {
    accessorKey: 'artistsCsv',
    header: 'Artists',
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.getValue('artistsCsv')),
  },
  {
    accessorKey: 'album.title',
    header: 'Album',
    cell: ({ row }) => h('div', { class: 'text-muted-foreground' }, row.getValue('album.title')),
  },
  {
    accessorKey: 'createdAt',
    header: 'Added',
    cell: ({ row }) =>
      h(
        'div',
        {},
        new Date(row.getValue('createdAt')).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      ),
  },
  {
    id: 'expand',
    header: '',
    enableHiding: false,
    cell: ({ row }) => {
      const versionCount = Array.isArray(row.original.versions) ? row.original.versions.length : 0
      const isExpanded = row.getIsExpanded()
      return h(
        'div',
        { class: 'flex items-center justify-end' },
        [
          h(
            resolveComponent('UButton') as any,
            {
              icon: isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down',
              color: 'neutral',
              variant: 'ghost',
              'aria-label': isExpanded ? 'Collapse row' : 'Expand row',
              onClick: () => row.toggleExpanded(),
            },
            () => [h('span', { class: 'ml-1 text-xs text-gray-500' }, `(${versionCount})`)],
          ),
        ],
      )
    },
  },
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
              :items="[{ label: 'Title', value: 'title' }, { label: 'Created', value: 'createdAt' }]" />
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
        :empty-state="{ icon: 'i-lucide-search', label: 'No tracks found' }">
        <template #expanded="{ row }">
          <TrackVersionsRow :versions="row.original.versions" :album="row.original.album" />
        </template>
      </UTable>
    </template>
  </UDashboardPanel>
</template>