<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  href?: string
  onPress?: (event: MouseEvent) => void
  label: string
  icon: Component
}>()
</script>

<template>
  <li class="flex flex-col gap-1 overflow-y-auto">
    <RouterLink v-if="href" :to="href" class="link" exact-active-class="bg-primary/10 text-primary">
      <component :is="icon" :size="16" />
      {{ label }}
    </RouterLink>

    <button v-else type="button" class="link" @click="onPress">
      <component :is="icon" :size="16" />
      {{ label }}
    </button>
  </li>
</template>

<style scoped>
@reference "@/styles/main.css";

.link {
  @apply flex items-center gap-3 rounded px-3 py-2 font-mono text-sm text-muted transition-colors hover:bg-primary/10 hover:text-primary;
  text-shadow: 0 0 8px rgba(255, 154, 60, 0.45);
}
</style>
