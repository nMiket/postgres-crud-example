<script setup lang="ts">
import SideBar from '@/components/dashboard/SideBar.vue'
import CrtOverlay from '@/components/shared/CrtOverlay.vue'
</script>

<template>
  <div class="flex min-h-screen bg-background text-text">
    <CrtOverlay />

    <SideBar />

    <!-- Main content -->
    <div class="flex flex-1 flex-col pl-60">
      <!-- Top bar -->
      <header
        class="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-primary/20 bg-background/90 px-6 backdrop-blur-sm"
      >
        <p class="font-mono text-sm text-muted">
          <span class="text-primary/40 font-display select-none">//</span>
          Welcome to Nerdstate
        </p>
      </header>

      <main class="flex-1 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
