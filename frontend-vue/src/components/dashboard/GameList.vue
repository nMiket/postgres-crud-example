<script setup lang="ts">
import type { GameRecord } from '@/composables/useGames'
import GameItem from './GameItem.vue'

const props = defineProps<{
  games: GameRecord[]
  loading: boolean
  error: string | null
  selectedGame: GameRecord | null
}>()

const emit = defineEmits<{
  select: [game: GameRecord]
}>()
</script>

<template>
  <div v-if="props.error" class="px-5 py-4 font-mono text-sm text-accent">
    SYSTEM ERROR: {{ props.error }}
  </div>

  <div
    v-else-if="props.loading"
    class="flex min-h-full flex-col items-center justify-center gap-4 px-5 py-8"
  >
    <div
      class="h-10 w-10 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
      aria-hidden="true"
    />
    <p class="font-display text-lg text-primary/80">LOADING...</p>
    <p class="font-mono text-xs text-muted/70">Fetching game cartridge data</p>
  </div>

  <div v-else-if="props.games.length === 0" class="px-5 py-4 font-mono text-sm text-muted">
    NO GAMES FOUND IN THE ARCHIVE.
  </div>

  <ul v-else class="space-y-2">
    <li v-for="game in props.games" :key="game.id">
      <GameItem :game="game" :selected-game="props.selectedGame" @select="emit('select', $event)" />
    </li>
  </ul>
</template>
