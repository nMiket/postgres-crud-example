<script setup lang="ts">
import type { GameRecord } from '@/composables/useGames'
import { getReleaseYear } from '@/utils/dates'
import { formatRating } from '@/utils/numbers'

const props = defineProps<{
  game: GameRecord
  selectedGame: GameRecord | null
}>()

const emit = defineEmits<{
  select: [game: GameRecord]
}>()

function isSelected(game: GameRecord) {
  return props.selectedGame?.id === game.id
}
</script>

<template>
  <button
    class="flex w-full flex-col gap-2 rounded border border-primary/25 bg-surface/70 p-4 text-left transition-all hover:border-primary/60 hover:bg-primary/10"
    style="
      box-shadow:
        0 0 14px rgba(255, 154, 60, 0.06),
        inset 0 0 20px rgba(255, 154, 60, 0.03);
    "
    :class="
      isSelected(game) ? 'border-primary bg-primary/20 shadow-[0_0_16px_rgba(255,154,60,0.25)]' : ''
    "
    @click="emit('select', game)"
  >
    <p class="font-display text-lg text-primary">{{ game.title ?? 'UNTITLED ROM' }}</p>
    <div class="mt-1 flex items-center justify-between font-mono text-xs text-muted/80">
      <span>{{ getReleaseYear(game.release_date) }}</span>
      <span>RATING: {{ formatRating(game.rating) }}</span>
    </div>
  </button>
</template>
