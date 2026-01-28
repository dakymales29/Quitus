import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/login.vue'
import Inicio from '../components/inicio.vue'

const routes = [
  { path: '/', component: Login },

  {
    path: '/inicio',
    component: Inicio,
    meta: { auth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🔐 PROTECCIÓN
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.auth && !token) {
    next('/')            // no logueado → login
  } else if (to.path === '/' && token) {
    next('/inicio')      // ya logueado → inicio
  } else {
    next()
  }
})

export default router
