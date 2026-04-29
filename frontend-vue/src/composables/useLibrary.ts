import { onMounted, ref } from 'vue'

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

const STORAGE_KEY = 'nerdstate_library'

export function useLibrary() {
  const backlog = ref<LibraryEntry[]>([])
  const loadingBacklog = ref(true)
  const mutating = ref(false)
  const error = ref<string | null>(null)

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        backlog.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load library from storage', e)
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(backlog.value))
    } catch (e) {
      console.error('Failed to save library to storage', e)
    }
  }

  async function fetchBacklog() {
    loadingBacklog.value = true
    error.value = null

    try {
      loadFromStorage()
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
      if (!backlog.value.find((entry) => entry.gameId === gameId)) {
        const newEntry: LibraryEntry = {
          id: `${Date.now()}-${Math.random()}`,
          gameId,
          status: 'wishlist',
          rating: null,
          notes: null,
          playCount: 0,
          startedAt: null,
          completedAt: null,
          createdAt: new Date().toISOString(),
          game: game || {
            id: gameId,
            rawg_id: null,
            title: null,
            slug: null,
            release_date: null,
            cover_url: null,
            rating: null,
          },
        }
        backlog.value.push(newEntry)
        saveToStorage()
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
      const entryIndex = backlog.value.findIndex((entry) => entry.id === entryId)
      if (entryIndex !== -1) {
        const currentEntry = backlog.value[entryIndex]!
        backlog.value[entryIndex] = {
          id: currentEntry.id,
          gameId: currentEntry.gameId,
          game: currentEntry.game,
          createdAt: currentEntry.createdAt,
          status: input.status,
          rating: input.rating,
          notes: input.notes,
          playCount: input.playCount,
          startedAt: input.startedAt,
          completedAt: input.completedAt,
        }
        saveToStorage()
      }
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
      backlog.value = backlog.value.filter((entry) => entry.id !== entryId)
      saveToStorage()
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
