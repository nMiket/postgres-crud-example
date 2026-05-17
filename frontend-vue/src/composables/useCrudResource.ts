import { onMounted, ref } from 'vue'

import { buildApiUrl } from '@/lib/api'

export function useCrudResource<
  Resource extends { id: string },
  CreateInput,
  UpdateInput extends Record<string, unknown>,
>(endpoint: string, options: { autoFetch?: boolean } = {}) {
  const items = ref<Resource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const mutating = ref(false)

  async function fetchAll() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(endpoint))
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const payload = (await response.json()) as Resource[]
      items.value = Array.isArray(payload) ? payload : []
    } catch (fetchError) {
      error.value = fetchError instanceof Error ? fetchError.message : 'Unknown error'
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function createItem(input: CreateInput) {
    mutating.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const created = (await response.json()) as Resource
      items.value = [...items.value, created] as Resource[]
      return created
    } catch (createError) {
      error.value = createError instanceof Error ? createError.message : 'Unknown error'
      throw createError
    } finally {
      mutating.value = false
    }
  }

  async function updateItem(id: string, input: UpdateInput) {
    mutating.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(`${endpoint}/${id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const updated = (await response.json()) as Resource
      items.value = items.value.map((item) => (item.id === id ? updated : item)) as Resource[]
      return updated
    } catch (updateError) {
      error.value = updateError instanceof Error ? updateError.message : 'Unknown error'
      throw updateError
    } finally {
      mutating.value = false
    }
  }

  async function deleteItem(id: string) {
    mutating.value = true
    error.value = null

    try {
      const response = await fetch(buildApiUrl(`${endpoint}/${id}`), {
        method: 'DELETE',
      })

      if (!response.ok && response.status !== 204) {
        throw new Error(`HTTP ${response.status}`)
      }

      items.value = items.value.filter((item) => item.id !== id)
    } catch (deleteError) {
      error.value = deleteError instanceof Error ? deleteError.message : 'Unknown error'
      throw deleteError
    } finally {
      mutating.value = false
    }
  }

  if (options.autoFetch !== false) {
    onMounted(fetchAll)
  }

  return {
    items,
    loading,
    error,
    mutating,
    fetchAll,
    createItem,
    updateItem,
    deleteItem,
  }
}
