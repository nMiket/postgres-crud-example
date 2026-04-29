import { computed, ref, type Ref } from 'vue'

import type { GameRecord } from './useGames'

export function useGameSearch(games: Ref<GameRecord[]>, selectedGame: Ref<GameRecord | null>) {
  const searchQuery = ref('')

  const filteredGames = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    if (!query) {
      return games.value
    }

    return games.value.filter((game) => (game.title ?? '').toLowerCase().includes(query))
  })

  const visibleSelectedGame = computed(() => {
    if (!selectedGame.value) {
      return null
    }

    return filteredGames.value.some((game) => game.id === selectedGame.value?.id)
      ? selectedGame.value
      : null
  })

  return {
    searchQuery,
    filteredGames,
    visibleSelectedGame,
  }
}
