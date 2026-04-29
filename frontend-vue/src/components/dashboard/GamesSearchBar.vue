<script setup lang="ts">
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="w-full md:w-80">
    <label for="games-search" class="sr-only">Search games</label>
    <input
      id="games-search"
      v-model="model"
      type="search"
      placeholder="Search by title..."
      class="h-10.5 w-full rounded border border-muted/30 bg-background px-4 font-mono text-sm text-text placeholder-muted/40 outline-none transition-colors focus:border-primary"
    />
  </div>
</template>
