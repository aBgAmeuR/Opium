<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin']
})
</script>

<template>
  <UDashboardPanel id="admin" class="min-h-auto">
    <template #header>
      <UDashboardNavbar title="Admin" :ui="{ right: 'gap-3' }">
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
        <div class="grid gap-2">
          <NuxtLink to="/admin/tracks" class="underline">Manage Tracks</NuxtLink>
        </div>
      </UCard>
    </template>
  </UDashboardPanel>
</template>

