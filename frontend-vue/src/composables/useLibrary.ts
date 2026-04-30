import { onMounted, ref } from 'vue'

import { buildApiUrl } from '@/lib/api'

interface GameSummary {
  id: string
  rawg_id: number | null
  title: string | null
  slug: string | null
  release_date: string | null
  cover_url: string | null
  rating: number | null
}

export interface LibraryEntry {
  id: string
  gameId: string
  status: 'wishlist' | 'playing' | 'completed' | 'dropped'
  rating: number | null
  notes: string | null
  playCount: number
  startedAt: string | null
  completedAt: string | null
  createdAt: string | null
  game: GameSummary
}

export interface UpdateLibraryEntryInput {
  status: 'wishlist' | 'playing' | 'completed' | 'dropped'
  rating: number | null
  notes: string | null
  playCount: number
  startedAt: string | null
  completedAt: string | null
}

type LibraryEntryApi = Omit<LibraryEntry, 'game'> & {
  game?: GameSummary
  game_id?: string
  gameId?: string
}

const LIBRARY_ENDPOINT = '/library'

function normalizeLibraryEntry(entry: LibraryEntryApi): LibraryEntry {
  const gameId = entry.game_id ?? entry.gameId ?? entry.game?.id ?? ''
  const game = entry.game ?? {
    id: gameId,
    rawg_id: null,
    title: null,
    slug: null,
    release_date: null,
    cover_url: null,
    rating: null,
  }

  return {
    id: entry.id,
    gameId,
    status: entry.status,
    rating: entry.rating,
    notes: entry.notes,
    playCount: entry.playCount,
    startedAt: entry.startedAt,
    completedAt: entry.completedAt,
    createdAt: entry.createdAt,
    game,
  }
}

export function useLibrary() {
  const backlog = ref<LibraryEntry[]>([])
  const loadingBacklog = ref(true)
  const mutating = ref(false)
  const error = ref<string | null>(null)

  async function fetchBacklog() {
    loadingBacklog.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(LIBRARY_ENDPOINT))

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const payload = (await response.json()) as LibraryEntryApi[]
      backlog.value = Array.isArray(payload) ? payload.map(normalizeLibraryEntry) : []
    } catch (fetchError) {
      error.value = fetchError instanceof Error ? fetchError.message : 'Unknown error'
      backlog.value = []
    } finally {
      loadingBacklog.value = false
    }
  }

  async function addToBacklog(gameId: string, game?: GameSummary) {
    mutating.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(LIBRARY_ENDPOINT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameId,
          game_id: gameId,
          game,
          status: 'wishlist',
          rating: null,
          notes: null,
          playCount: 0,
          startedAt: null,
          completedAt: null,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const createdEntry = normalizeLibraryEntry((await response.json()) as LibraryEntryApi)
      if (!backlog.value.some((entry) => entry.id === createdEntry.id)) {
        backlog.value = [...backlog.value, createdEntry]
      }
    } catch (upsertError) {
      error.value = upsertError instanceof Error ? upsertError.message : 'Unknown error'
    } finally {
      mutating.value = false
    }
  }

  async function updateBacklogEntry(entryId: string, input: UpdateLibraryEntryInput) {
    mutating.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(`${LIBRARY_ENDPOINT}/${entryId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const updatedEntry = normalizeLibraryEntry((await response.json()) as LibraryEntryApi)
      backlog.value = backlog.value.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry,
      )
    } catch (updateError) {
      error.value = updateError instanceof Error ? updateError.message : 'Unknown error'
    } finally {
      mutating.value = false
    }
  }

  async function removeFromBacklog(entryId: string) {
    mutating.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(`${LIBRARY_ENDPOINT}/${entryId}`), {
        method: 'DELETE',
      })

      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP ${response.status}`)
      }

      backlog.value = backlog.value.filter((entry) => entry.id !== entryId)
    } catch (deleteError) {
      error.value = deleteError instanceof Error ? deleteError.message : 'Unknown error'
    } finally {
      mutating.value = false
    }
  }

  onMounted(() => {
    fetchBacklog()
  })

  return {
    backlog,
    loadingBacklog,
    mutating,
    error,
    fetchBacklog,
    addToBacklog,
    updateBacklogEntry,
    removeFromBacklog,
  }
}
