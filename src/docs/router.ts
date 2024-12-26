import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    // no routes at the moment
    // {
    //   path: '/',
    //   name: 'Home',
    //   component: () => import('./pages/home.vue')
    // }
  ]
})

export default router
