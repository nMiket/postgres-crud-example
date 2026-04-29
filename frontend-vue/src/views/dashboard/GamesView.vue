<script setup lang="ts">
import { computed } from 'vue'

import { GameList, GamesSearchBar, PageHeader, RetroPanel } from '@/components/dashboard'
import { useGameSearch } from '@/composables/useGameSearch'
import { useGames } from '@/composables/useGames'
import { useLibrary } from '@/composables/useLibrary'
import { formatDate } from '@/utils/dates'
import { formatRating } from '@/utils/numbers'

const { games, selectedGame, loading, error, selectGame } = useGames()
const { backlog, mutating: libraryMutating, error: libraryError, addToBacklog } = useLibrary()
const { searchQuery, filteredGames, visibleSelectedGame } = useGameSearch(games, selectedGame)

const selectedTitle = computed(() => visibleSelectedGame.value?.title ?? 'NO SIGNAL')
const selectedSlug = computed(() => visibleSelectedGame.value?.slug ?? 'unknown-slug')
const isInLibrary = computed(() => {
  if (!visibleSelectedGame.value) return false
  return backlog.value.some((entry) => entry.gameId === visibleSelectedGame.value?.id)
})

async function handleAddToLibrary() {
  if (!visibleSelectedGame.value) return
  await addToBacklog(visibleSelectedGame.value.id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <PageHeader title="GALLERY" subtitle="Browse all available retro games from the archive." />

      <GamesSearchBar v-model="searchQuery" />
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <RetroPanel
        class="xl:h-[calc(100vh-14rem)]"
        title="AVAILABLE GAMES"
        :status="loading ? '[ LOADING ]' : `[ ${filteredGames.length} ]`"
      >
        <GameList
          :games="filteredGames"
          :loading="loading"
          :error="error"
          :selected-game="visibleSelectedGame"
          @select="selectGame"
        />
      </RetroPanel>

      <RetroPanel class="xl:h-[calc(100vh-14rem)]" title="GAME DETAIL" status="[SELECTED]">
        <div v-if="visibleSelectedGame" class="space-y-5 p-5">
          <div
            class="aspect-video w-full overflow-hidden rounded border border-primary/20 bg-background/70"
          >
            <img
              v-if="visibleSelectedGame.cover_url"
              :src="visibleSelectedGame.cover_url"
              :alt="selectedTitle"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center font-mono text-sm text-muted"
            >
              NO COVER ART
            </div>
          </div>

          <div class="space-y-2">
            <h2 class="retro-glow font-display text-2xl text-primary">{{ selectedTitle }}</h2>
            <p class="font-mono text-xs text-muted break-all">slug: {{ selectedSlug }}</p>
          </div>

          <div class="flex items-center gap-3">
            <button
              type="button"
              class="rounded border border-primary/35 bg-primary/10 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
              :disabled="libraryMutating || isInLibrary"
              @click="handleAddToLibrary"
            >
              {{ isInLibrary ? 'IN LIBRARY' : 'ADD TO LIBRARY' }}
            </button>

            <p v-if="libraryError" class="font-mono text-xs text-accent">{{ libraryError }}</p>
          </div>

          <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div class="retro-stat">
              <dt>RELEASE</dt>
              <dd>{{ formatDate(visibleSelectedGame.release_date) }}</dd>
            </div>
            <div class="retro-stat">
              <dt>RATING</dt>
              <dd>{{ formatRating(visibleSelectedGame.rating) }}</dd>
            </div>
            <div class="retro-stat sm:col-span-2">
              <dt>RAWG ID</dt>
              <dd class="break-all">{{ visibleSelectedGame.rawg_id ?? 'N/A' }}</dd>
            </div>
          </dl>
        </div>

        <div v-else class="p-5 font-mono text-sm text-muted">SELECT A GAME...</div>
      </RetroPanel>
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.retro-glow {
  text-shadow: 0 0 14px rgba(255, 154, 60, 0.5);
}

.retro-stat {
  @apply rounded border border-primary/20 bg-background/60 p-3;
}

.retro-stat dt {
  @apply font-mono text-[11px] tracking-widest text-muted/70;
}

.retro-stat dd {
  @apply mt-1 font-display text-sm text-primary;
}
</style>
