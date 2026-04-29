<template>
  <div class="crt-overlay pointer-events-none fixed inset-0 z-50" />
</template>

<style scoped>
.crt-overlay {
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  animation: flicker 12s step-end infinite;
}

@keyframes flicker {
  0%,
  89%,
  91%,
  93%,
  100% {
    opacity: 1;
  }

  90% {
    opacity: 0.93;
  }

  92% {
    opacity: 0.97;
  }
}
</style>
