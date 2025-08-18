<script setup lang="ts">
import type { TableColumn } from '#ui/types'

definePageMeta({ middleware: ['auth', 'admin'] })

const { $orpc } = useNuxtApp()

const search = ref('')
const sortBy = ref<'createdAt'>('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')

const versions = ["official", "remix", "performance", "remastered", "remastered AI", "AI", "fan made", "feature", "leak", "other"] as const
const versionType = ref<'all' | typeof versions[number]>('all')

const { data: tracks, isPending, refetch } = useQuery(computed(() =>
    $orpc.tracks.list.queryOptions({
        input: {
            query: search.value || undefined,
            sortBy: sortBy.value,
            sortDir: sortDir.value,
            versionType: versionType.value === 'all' ? undefined : versionType.value,
            limit: 100,
            offset: 0,
        },
    })),
)

type TrackRow = {
    id: number
    title: string
    artistsCsv: string
    createdAt: string | Date
    album: { coverUrl?: string } | null
    versions: Array<{ id: number; type: string; title: string; artists: string[]; fileUrl?: string }>
}

const rows = computed<TrackRow[]>(() =>
    (tracks.value?.items ?? []).map((t: any) => ({
        id: t.id,
        title: t.title ?? 'untitled',
        artistsCsv: Array.isArray(t.artists) ? t.artists.join(', ') : '',
        createdAt: t.createdAt,
        album: t.album,
        versions: t.versions,
    }))
)

const NuxtLink = resolveComponent('NuxtLink')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<TrackRow>[] = [
    {
        id: 'select',
        header: ({ table }) => h(UCheckbox as any, {
            modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
            'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
            'aria-label': 'Select all',
        }),
        cell: ({ row }) => h(UCheckbox as any, {
            modelValue: row.getIsSelected(),
            'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
            'aria-label': 'Select row',
        }),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => h(NuxtLink as any, { to: `/admin/tracks/${row.original.id}`, class: 'underline' }, () => row.getValue('title')),
    },
    {
        accessorKey: 'artistsCsv',
        header: 'Artists',
        cell: ({ row }) => h('div', row.getValue('artistsCsv')),
    },
    {
        accessorKey: 'createdAt',
        header: 'Added',
        cell: ({ row }) => h('div', {}, new Date(row.getValue('createdAt')).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })),
    },
    {
        id: 'actions',
        header: '',
        enableHiding: false,
        cell: ({ row }) => {
            const items = [
                { type: 'label', label: 'Actions' },
                { label: row.getIsExpanded() ? 'Collapse' : 'Expand', onSelect: () => row.toggleExpanded() },
                { type: 'separator' },
                { label: 'Edit', onSelect: () => navigateTo(`/admin/tracks/${row.original.id}`) },
                { label: 'Delete', onSelect: () => onDelete(row.original.id) },
            ]
            const versionCount = Array.isArray(row.original.versions) ? row.original.versions.length : 0
            const isExpanded = row.getIsExpanded()
            return h('div', { class: 'flex items-center justify-end gap-2' }, [
                h(UButton, {
                    icon: isExpanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down',
                    color: 'neutral',
                    variant: 'ghost',
                    class: 'mr-1',
                    'aria-label': isExpanded ? 'Collapse row' : 'Expand row',
                    onClick: () => row.toggleExpanded(),
                }, () => [
                    h('span', { class: 'ml-1 text-xs text-gray-500' }, `(${versionCount})`),
                ]),
                h(UDropdownMenu, { content: { align: 'end' }, items, 'aria-label': 'Actions dropdown' }, {
                    default: () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', 'aria-label': 'Actions dropdown' }),
                }),
            ])
        },
    },
]

const queryClient = useQueryClient()
const removeTrack = useMutation(
    $orpc.tracks.remove.mutationOptions({
        onSuccess: () => queryClient.invalidateQueries({ queryKey: $orpc.tracks.list.key() }),
    }),
)

const onDelete = async (id: number) => {
    if (!confirm('Delete this track? This cannot be undone.')) return
    await removeTrack.mutateAsync({ id })
}
</script>

<template>
    <UDashboardPanel id="admin-tracks" class="min-h-auto">
      <template #header>
        <UDashboardNavbar title="Admin Tracks" :ui="{ right: 'gap-3' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
  
          <template #right>
            <UColorModeButton />
            <UButton icon="i-lucide-plus" to="/admin/tracks/new">New Track</UButton>
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
        <UTable :data="rows" :columns="columns" :loading="isPending" loading-animation="carousel"
          :empty-state="{ icon: 'i-lucide-search', label: 'No tracks found' }" :ui="{ td: 'p-2', th: 'p-2' }">
          <template #expanded="{ row }">
            <TrackVersionsRow :versions="row.original.versions" :album="row.original.album" />
          </template>
        </UTable>
      </template>
    </UDashboardPanel>
  </template>