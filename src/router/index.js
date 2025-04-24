import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllCereals from '@/views/AllCereals.vue'
import CerealDetail from '@/views/CerealDetail.vue'

const routes = [
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
    {

      path: '/cereal/:id',
      name: 'CerealDetail',
      component: CerealDetail,
      meta: {
        title: 'Cereal Detail',
      },
      props: true,
    },
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top
    return { top: 0 }
  },
})

export default router
