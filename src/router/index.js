import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllCereals from '@/views/AllCereals.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/all-cereals',
      name: 'all-cereals',
      component: AllCereals,
      meta: {
        title: 'All Cereals',
      },
    },
  ],
})

export default router
