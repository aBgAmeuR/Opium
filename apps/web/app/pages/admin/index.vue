<script setup lang="ts">
definePageMeta({
  middleware: ['auth','admin']
})
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Admin</h1>
    </div>
    <UCard>
      <div class="grid gap-2">
        <NuxtLink to="/admin/tracks" class="underline">Manage Tracks</NuxtLink>
      </div>
    </UCard>
  </div>
  
</template>


