import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'overview',
      component: () => import('./pages/overview.vue')
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('./pages/demo.vue')
    },
    {
      path: '/usage',
      name: 'usage',
      component: () => import('./pages/usage.vue')
    },
    {
      path: '/install',
      redirect: '/usage'
    },
    {
      path: '/javascript',
      redirect: '/usage'
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./pages/settings.vue')
    },
    {
      path: '/style',
      name: 'style',
      component: () => import('./pages/style.vue')
    },
    {
      path: '/vue',
      name: 'vue',
      component: () => import('./pages/vue.vue')
    },
    {
      path: '/react',
      name: 'react',
      component: () => import('./pages/react.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('./pages/privacy.vue')
    }
  ]
})

export default router

// Ensure scroll-to-top in our scrollable container on navigation
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  router.afterEach(() => {
    const scroller = document.querySelector('#app .layout') as HTMLElement | null
    if (scroller) {
      scroller.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' as ScrollBehavior })
    }
  })
}
