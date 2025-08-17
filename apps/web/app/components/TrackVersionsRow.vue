<script setup lang="ts">
import type PlayerBar from './PlayerBar.vue';

const props = defineProps<{ 
  versions: Array<{ id: number; type: string; title: string; artists: string[]; fileUrl?: string }>,
  album?: { coverUrl?: string } | null
}>()

const player = inject<Ref<InstanceType<typeof PlayerBar> | null>>('appPlayer')

function playVersion(v: any) {
  if (!v?.fileUrl || !player?.value) return
  player.value.load({ title: v.title, artists: v.artists, url: v.fileUrl, coverUrl: props.album?.coverUrl })
}

</script>

<template>
  <div class="py-2 pl-7">
      <div v-if="!versions?.length" class="text-sm text-muted-foreground">No versions yet.</div>
      <ul v-else class="grid gap-3">
        <li v-for="v in versions" :key="v.id" class="grid gap-2">
          <div class="flex items-center gap-2">
            <div>
              <div class="font-medium text-highlighted">{{ v.title }}</div>
              <div v-if="Array.isArray(v.artists) && v.artists.length" class="text-xs text-muted-foreground">
                {{ v.artists.join(', ') }}
              </div>
            </div>
            <UBadge size="md" color="neutral" variant="outline">{{ v.type }}</UBadge>
            <UButton
              size="sm"
              icon="i-lucide-play"
              class="cursor-pointer"
              variant="soft"
              @click="playVersion(v)"
            >
              Play
            </UButton>
          </div>
        </li>
      </ul>
  </div>
</template>


