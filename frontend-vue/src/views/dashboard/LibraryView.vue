<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { PageHeader, RetroPanel } from '@/components/dashboard'
import { useLibrary } from '@/composables/useLibrary'

const { backlog, loadingBacklog, mutating, error, updateBacklogEntry, removeFromBacklog } =
  useLibrary()

const backlogQuery = ref('')
const selectedEntryId = ref<string | null>(null)
const status = ref<'wishlist' | 'playing' | 'completed' | 'dropped'>('wishlist')
const rating = ref<string>('')
const notes = ref('')
const playCount = ref<string>('0')
const startedAt = ref('')
const completedAt = ref('')

const statusOptions = [
  { value: 'wishlist', label: 'WISHLIST' },
  { value: 'playing', label: 'PLAYING' },
  { value: 'completed', label: 'COMPLETED' },
  { value: 'dropped', label: 'DROPPED' },
] as const

const filteredBacklog = computed(() => {
  const query = backlogQuery.value.trim().toLowerCase()

  if (!query) return backlog.value

  return backlog.value.filter((entry) => {
    const title = entry.game.title?.toLowerCase() ?? ''
    const slug = entry.game.slug?.toLowerCase() ?? ''
    return title.includes(query) || slug.includes(query)
  })
})

const selectedEntry = computed(
  () => filteredBacklog.value.find((entry) => entry.id === selectedEntryId.value) ?? null,
)

watch(
  filteredBacklog,
  (entries) => {
    if (!entries.length) {
      selectedEntryId.value = null
      return
    }

    if (!selectedEntryId.value || !entries.some((entry) => entry.id === selectedEntryId.value)) {
      const firstEntry = entries[0]
      selectedEntryId.value = firstEntry ? firstEntry.id : null
    }
  },
  { immediate: true },
)

watch(
  selectedEntry,
  (entry) => {
    if (!entry) {
      status.value = 'wishlist'
      rating.value = ''
      notes.value = ''
      playCount.value = '0'
      startedAt.value = ''
      completedAt.value = ''
      return
    }

    status.value = entry.status
    rating.value = entry.rating === null ? '' : String(entry.rating)
    notes.value = entry.notes ?? ''
    playCount.value = String(entry.playCount)
    startedAt.value = entry.startedAt ?? ''
    completedAt.value = entry.completedAt ?? ''
  },
  { immediate: true },
)

async function handleUpdate() {
  if (!selectedEntry.value) return

  const parsedRating = rating.value.trim() === '' ? null : Number(rating.value)
  const parsedPlayCount = Number(playCount.value)

  await updateBacklogEntry(selectedEntry.value.id, {
    status: status.value,
    rating: Number.isFinite(parsedRating) ? parsedRating : null,
    notes: notes.value.trim() === '' ? null : notes.value,
    playCount: Number.isFinite(parsedPlayCount) && parsedPlayCount > 0 ? parsedPlayCount : 0,
    startedAt: startedAt.value || null,
    completedAt: completedAt.value || null,
  })
}

async function handleDelete() {
  if (!selectedEntry.value) return
  await removeFromBacklog(selectedEntry.value.id)
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <PageHeader
      title="LIBRARY"
      subtitle="Manage your personal game backlog and queue new titles to play."
    />

    <div
      v-if="error"
      class="rounded border border-accent/30 bg-accent/10 px-4 py-3 font-mono text-sm text-accent"
    >
      SYSTEM ERROR: {{ error }}
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <RetroPanel
        class="xl:h-[calc(100vh-14rem)]"
        title="YOUR BACKLOG"
        :status="loadingBacklog ? '[ LOADING ]' : `[ ${filteredBacklog.length} ]`"
      >
        <div class="space-y-4">
          <input
            v-model="backlogQuery"
            type="search"
            placeholder="Search backlog by title or slug..."
            class="w-full rounded border border-primary/25 bg-background/70 px-3 py-2 font-mono text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none"
          />

          <div v-if="loadingBacklog" class="font-mono text-sm text-muted">Loading backlog...</div>

          <ul v-else-if="filteredBacklog.length" class="space-y-2">
            <li
              v-for="entry in filteredBacklog"
              :key="entry.id"
              class="cursor-pointer rounded border px-3 py-2 transition-colors"
              :class="
                selectedEntryId === entry.id
                  ? 'border-primary/45 bg-primary/10'
                  : 'border-primary/20 bg-background/50 hover:bg-primary/5'
              "
              @click="selectedEntryId = entry.id"
            >
              <div class="min-w-0">
                <p class="truncate font-display text-sm text-primary">
                  {{ entry.game.title ?? 'UNTITLED GAME' }}
                </p>
                <p class="truncate font-mono text-[11px] text-muted">
                  {{ entry.game.slug ?? 'no-slug' }} · {{ entry.status }}
                </p>
              </div>
            </li>
          </ul>

          <p v-else class="font-mono text-sm text-muted">NO GAMES IN YOUR BACKLOG.</p>
        </div>
      </RetroPanel>

      <RetroPanel
        class="xl:h-[calc(100vh-14rem)]"
        title="BACKLOG DETAIL"
        :status="selectedEntry ? '[ EDIT ]' : '[ SELECT ]'"
      >
        <form v-if="selectedEntry" class="space-y-4" @submit.prevent="handleUpdate">
          <div class="space-y-1">
            <p class="font-display text-lg text-primary">
              {{ selectedEntry.game.title ?? 'UNTITLED GAME' }}
            </p>
            <p class="font-mono text-xs text-muted break-all">
              {{ selectedEntry.game.slug ?? 'no-slug' }}
            </p>
          </div>

          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label class="field">
              <span class="field__label">STATUS</span>
              <select v-model="status" class="field__input">
                <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </label>

            <label class="field">
              <span class="field__label">RATING</span>
              <input v-model="rating" class="field__input" type="number" min="0" max="100" />
            </label>

            <label class="field">
              <span class="field__label">PLAY COUNT</span>
              <input v-model="playCount" class="field__input" type="number" min="0" />
            </label>

            <label class="field">
              <span class="field__label">STARTED AT</span>
              <input v-model="startedAt" class="field__input" type="date" />
            </label>

            <label class="field sm:col-span-2">
              <span class="field__label">COMPLETED AT</span>
              <input v-model="completedAt" class="field__input" type="date" />
            </label>

            <label class="field sm:col-span-2">
              <span class="field__label">NOTES</span>
              <textarea v-model="notes" class="field__textarea" rows="4" />
            </label>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="submit"
              class="rounded border border-primary/35 bg-primary/10 px-3 py-2 font-mono text-xs text-primary transition-colors hover:bg-primary/20 disabled:opacity-60"
              :disabled="mutating"
            >
              SAVE
            </button>

            <button
              type="button"
              class="rounded border border-accent/40 bg-accent/10 px-3 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent/20 disabled:opacity-60"
              :disabled="mutating"
              @click="handleDelete"
            >
              DELETE
            </button>
          </div>
        </form>

        <p v-else class="font-mono text-sm text-muted">SELECT A GAME IN YOUR BACKLOG.</p>
      </RetroPanel>
    </div>
  </div>
</template>

<style scoped>
@reference "@/styles/main.css";

.field {
  @apply flex flex-col gap-1;
}

.field__label {
  @apply font-mono text-[11px] tracking-widest text-muted/70;
}

.field__input,
.field__textarea {
  @apply w-full rounded border border-primary/25 bg-background/70 px-3 py-2 font-mono text-sm text-text placeholder:text-muted focus:border-primary focus:outline-none;
}

.field__textarea {
  resize: vertical;
}
</style>
