import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/home.vue')
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
      component: () => import('./pages/settings.vue'),
      meta: { sidebar: true }
    },
    {
      path: '/core',
      name: 'core',
      component: () => import('./pages/core.vue'),
      meta: { sidebar: true }
    },
    {
      path: '/style',
      name: 'style',
      component: () => import('./pages/style.vue'),
      meta: { wide: true }
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
      path: '/gif',
      name: 'gif',
      component: () => import('./pages/gif.vue')
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('./pages/privacy.vue')
    }
  ]
})

export default router

// Scroll the app layout container after navigation (window scroll is unused)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  router.afterEach((to) => {
    const scroller = document.querySelector('#app .layout') as HTMLElement | null

    // In-page hashes (e.g. /settings#ui-pickerShow) are handled by the page after it mounts
    if (to.hash) {
      return
    }

    if (scroller) {
      scroller.scrollTo({ left: 0, top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' as ScrollBehavior })
    }
  })
}

