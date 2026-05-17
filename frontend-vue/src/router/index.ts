import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PrivateLayout.vue'),
      children: [
        {
          path: '',
          component: () => import('@/views/dashboard/BarbershopView.vue'),
        },
      ],
    },
  ],
})

export default router
