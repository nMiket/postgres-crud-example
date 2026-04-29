import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PrivateLayout.vue'),
      children: [
        {
          path: 'games',
          component: () => import('@/views/dashboard/GamesView.vue'),
        },
        {
          path: 'library',
          component: () => import('@/views/dashboard/LibraryView.vue'),
        },
      ],
    },
  ],
})

export default router
