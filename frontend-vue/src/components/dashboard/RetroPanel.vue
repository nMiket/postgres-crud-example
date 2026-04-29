<script setup lang="ts">
defineProps<{
  title: string
  status?: string
}>()
</script>

<template>
  <section
    class="flex flex-col overflow-hidden rounded border border-primary/20 bg-surface/60"
    style="box-shadow: 0 0 18px rgba(255, 154, 60, 0.05)"
  >
    <div
      class="flex items-center justify-between border-b border-primary/20 bg-primary/5 px-5 py-3"
    >
      <span class="font-display text-sm tracking-widest text-primary">{{ title }}</span>
      <span class="font-mono text-xs text-muted/50">{{ status }}</span>
    </div>

    <div class="retro-panel__content min-h-0 overflow-y-auto px-5 py-4">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.retro-panel__content {
  scrollbar-width: thin;
  scrollbar-color: color-mix(in oklab, var(--color-primary) 65%, transparent)
    color-mix(in oklab, var(--color-surface) 85%, black);
}

.retro-panel__content::-webkit-scrollbar {
  width: 10px;
}

.retro-panel__content::-webkit-scrollbar-track {
  background: color-mix(in oklab, var(--color-surface) 88%, black);
}

.retro-panel__content::-webkit-scrollbar-thumb {
  background: color-mix(in oklab, var(--color-primary) 70%, transparent);
  border-radius: 9999px;
  border: 2px solid color-mix(in oklab, var(--color-surface) 88%, black);
}

.retro-panel__content::-webkit-scrollbar-thumb:hover {
  background: color-mix(in oklab, var(--color-primary) 85%, transparent);
}
</style>
