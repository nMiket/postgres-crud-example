import { onMounted, ref } from 'vue'

import { buildApiUrl } from '@/lib/api'

export interface GameRecord {
  id: string
  rawg_id: number | null
  title: string | null
  slug: string | null
  release_date: string | null
  cover_url: string | null
  rating: number | null
}

type GameApiRecord = Partial<GameRecord> & {
  rawgId?: number | null
  releaseDate?: string | null
  coverUrl?: string | null
  rating?: number | null
}

function normalizeGame(record: GameApiRecord): GameRecord {
  const id = record.id ?? ''

  return {
    id,
    rawg_id: record.rawg_id ?? record.rawgId ?? null,
    title: record.title ?? null,
    slug: record.slug ?? null,
    release_date: record.release_date ?? record.releaseDate ?? null,
    cover_url: record.cover_url ?? record.coverUrl ?? null,
    rating: record.rating ?? null,
  }
}

export function useGames() {
  const games = ref<GameRecord[]>([])
  const selectedGame = ref<GameRecord | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchGames() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl('/games'))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const payload = (await response.json()) as GameApiRecord[]
      games.value = Array.isArray(payload) ? payload.map(normalizeGame) : []
      selectedGame.value = null
    } catch (fetchError) {
      error.value = fetchError instanceof Error ? fetchError.message : 'Unknown error'
      games.value = []
      selectedGame.value = null
    } finally {
      loading.value = false
    }
  }

  function selectGame(game: GameRecord) {
    selectedGame.value = game
  }

  onMounted(fetchGames)

  return {
    games,
    selectedGame,
    loading,
    error,
    fetchGames,
    selectGame,
  }
}
