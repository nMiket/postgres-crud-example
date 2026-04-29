import { onMounted, ref } from 'vue'

export interface GameRecord {
  id: string
  rawg_id: number | null
  title: string | null
  slug: string | null
  release_date: string | null
  cover_url: string | null
  rating: number | null
}

const GAMES_STORAGE_KEY = 'nerdstate_games'

const MOCK_GAMES: GameRecord[] = [
  {
    id: '1',
    rawg_id: 1,
    title: 'Elden Ring',
    slug: 'elden-ring',
    release_date: '2022-02-25',
    cover_url: 'https://media.rawg.io/media/games/8f8/8f82c19662b3e8e72e0487e7bc5afeaf.jpg',
    rating: 4.5,
  },
  {
    id: '2',
    rawg_id: 2,
    title: "Baldur's Gate 3",
    slug: 'baldurs-gate-3',
    release_date: '2023-08-03',
    cover_url: 'https://media.rawg.io/media/games/b7d/b7d8786585f5a7b58e6b2a7e3f3f3f3f.jpg',
    rating: 4.7,
  },
  {
    id: '3',
    rawg_id: 3,
    title: 'The Witcher 3',
    slug: 'the-witcher-3',
    release_date: '2015-05-19',
    cover_url: 'https://media.rawg.io/media/games/21c/21cc0d4d6d00b0984bcef621b0d8bf5e.jpg',
    rating: 4.6,
  },
]

export function useGames() {
  const games = ref<GameRecord[]>([])
  const selectedGame = ref<GameRecord | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchGames() {
    loading.value = true
    error.value = null

    try {
      const stored = localStorage.getItem(GAMES_STORAGE_KEY)
      if (stored) {
        games.value = JSON.parse(stored) as GameRecord[]
      } else {
        games.value = MOCK_GAMES
        localStorage.setItem(GAMES_STORAGE_KEY, JSON.stringify(MOCK_GAMES))
      }
      selectedGame.value = null
    } catch (fetchError) {
      error.value = fetchError instanceof Error ? fetchError.message : 'Unknown error'
      games.value = MOCK_GAMES
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
