<script setup lang="ts">
import { BookMarked, Gamepad2 } from 'lucide-vue-next'

import AppLogo from '@/components/shared/AppLogo.vue'
import NavItem from './NavItem.vue'
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-primary/20 bg-surface"
    style="box-shadow: inset 0 0 28px rgba(255, 154, 60, 0.04)"
  >
    <div class="flex h-16 items-center justify-center border-b border-primary/20">
      <AppLogo />
    </div>

    <nav class="flex flex-1 flex-col gap-1 px-3 py-4">
      <NavItem href="/games" label="Gallery" :icon="Gamepad2" />
      <NavItem href="/library" label="Library" :icon="BookMarked" />
    </nav>

    <div class="flex flex-col gap-1 border-t border-primary/20 px-3 pb-8 pt-4"></div>
  </aside>
</template>
