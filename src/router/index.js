import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllCereals from '@/views/AllCereals.vue'
import CerealDetail from '@/views/CerealDetail.vue'
import LoginPage from '@/views/LoginPage.vue'
import RegisterUser from '@/views/RegisterUser.vue'
import { useCerealStore } from '@/stores/cerealStore'

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
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: {
      title: 'Login',
    },
    beforeEnter: (to, from, next) => {
      const store = useCerealStore()
      if (store.isAuthenticated) {
        next({ name: 'home' }) // Redirect to home if already logged in
      } else {
        next() // Proceed to login page
      }
    },
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: RegisterUser,
    meta: {
      title: 'Register',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
