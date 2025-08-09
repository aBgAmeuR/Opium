<script setup lang="ts">
import PlayerBar from '~/components/PlayerBar.vue'
const player = ref<InstanceType<typeof PlayerBar> | null>(null)
provide('appPlayer', player)
</script>

<template>
    <div class="grid grid-rows-[auto_1fr_auto] min-h-screen">
        <Header />
        <main class="overflow-y-auto py-4">
            <slot />
        </main>
        <PlayerBar ref="player" />
    </div>
</template>
