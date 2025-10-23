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
      path: '/install',
      name: 'install',
      component: () => import('./pages/install.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./pages/settings.vue')
    },
    {
      path: '/examples',
      name: 'examples',
      component: () => import('./pages/examples.vue')
    },
    {
      path: '/vue',
      name: 'vue',
      component: () => import('./pages/vue.vue')
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
