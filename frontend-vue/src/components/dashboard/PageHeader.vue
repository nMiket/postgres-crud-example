<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-1">
    <h1 class="flex items-center gap-2 font-display text-2xl tracking-wider text-primary">
      <span class="select-none text-xl text-muted/50">&gt;&nbsp;</span>{{ title
      }}<span class="cursor-blink">_</span>
    </h1>

    <p class="font-mono text-sm text-muted">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.cursor-blink {
  animation: blink 1.1s step-end infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
