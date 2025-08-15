<script setup lang="ts">
import PlayerBar from '~/components/PlayerBar.vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const player = ref<InstanceType<typeof PlayerBar> | null>(null)
provide('appPlayer', player)

const route = useRoute()

const open = ref(false)

const links = [[{
    label: 'Dashboard',
    icon: 'i-lucide-home',
    to: '/',
    onSelect: () => {
        open.value = false
    }
}, {
    label: 'Tracks',
    icon: 'i-lucide-music',
    to: '/tracks',
    onSelect: () => {
        open.value = false
    }
}, {
    label: 'Settings',
    to: '/settings',
    icon: 'i-lucide-settings',
    onSelect: () => {
        open.value = false
    }
}], [{
    label: 'Feedback',
    icon: 'i-lucide-message-circle',
    to: 'https://github.com/nuxt-ui-pro/dashboard',
    target: '_blank'
}, {
    label: 'Help & Support',
    icon: 'i-lucide-info',
    to: 'https://github.com/nuxt/ui-pro',
    target: '_blank'
}]] satisfies NavigationMenuItem[][]

const groups = computed(() => [{
    id: 'links',
    label: 'Go to',
    items: links.flat()
}, {
    id: 'code',
    label: 'Code',
    items: [{
        id: 'source',
        label: 'View page source',
        icon: 'i-simple-icons-github',
        to: `https://github.com/nuxt-ui-pro/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
        target: '_blank'
    }]
}])

</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar id="default" v-model:open="open" collapsible resizable class="bg-elevated/25"
            :ui="{ footer: 'lg:border-t lg:border-default' }">
            <template #header="{ collapsed }">
                <UButton label="Carti Vault" color="neutral" variant="ghost" block :square="collapsed"
                    class="data-[state=open]:bg-elevated" :class="[!collapsed && 'py-2']" />
            </template>

            <template #default="{ collapsed }">
                <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

                <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />

                <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" tooltip
                    class="mt-auto" />
            </template>

            <template #footer="{ collapsed }">
                <UserMenu :collapsed="collapsed" />
            </template>
        </UDashboardSidebar>

        <UDashboardSearch :groups="groups" />

        <div class="flex flex-col min-h-screen w-full">
            <slot />
            <PlayerBar ref="player" />
        </div>

        
    </UDashboardGroup>
</template>
