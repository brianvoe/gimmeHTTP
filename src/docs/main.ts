import './assets/scss/index.scss'

import { createApp } from 'vue'
import router from './router'

import App from './app.vue'

const GA_MEASUREMENT_ID = 'G-5W4447QCL9'

declare global {
  interface Window {
    dataLayer: unknown[][]
    gtag?: (...args: unknown[]) => void
  }
}

function loadGoogleAnalytics() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return
  }

  const existingScript = document.querySelector(
    `script[src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
  )

  if (!existingScript) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  }

  window.dataLayer = window.dataLayer || []
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args)
    }

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
}

function trackPageView(path: string) {
  if (typeof window === 'undefined') {
    return
  }

  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title
  })
}

loadGoogleAnalytics()

const app = createApp(App)
app.use(router)
app.mount('#app')

router.isReady().then(() => {
  trackPageView(router.currentRoute.value.fullPath)
})

router.afterEach((to) => {
  trackPageView(to.fullPath)
})
