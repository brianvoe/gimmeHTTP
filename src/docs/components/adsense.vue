<script lang="ts">
  import { defineComponent, nextTick } from 'vue'

  let adsScriptAppended = false

  export default defineComponent({
    name: 'SmartAdSense',
    props: {
      adClient: { type: String, default: 'ca-pub-4428453911800052' },
      adSlot: { type: String, default: '', required: true },
      adFormat: { type: String, default: 'auto' },
      fullWidthResponsive: { type: [Boolean, String], default: true },
      // Minimum content length to show ads (characters)
      minContentLength: { type: Number, default: 150 },
      // Minimum number of sentences to show ads
      minSentences: { type: Number, default: 2 }
    },
    data() {
      return {
        isContentReady: false,
        shouldShowAd: false,
        contentCheckAttempts: 0,
        maxContentCheckAttempts: 5,
        excludedRoutes: ['/404', '/not-found', '/under-construction', '/placeholder']
      }
    },
    computed: {
      show(): boolean {
        return this.shouldShowAd && this.isContentReady
      },
      isRouteExcluded(): boolean {
        return this.excludedRoutes.some(
          (excludedRoute) =>
            this.$route.path.includes(excludedRoute) ||
            this.$route.name?.toString().toLowerCase().includes('404') ||
            this.$route.name?.toString().toLowerCase().includes('not-found')
        )
      },
      isLocalhost(): boolean {
        return location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      }
    },
    async mounted() {
      // Initial content check
      await this.evaluateAdDisplay()

      // If no content found initially, retry with backoff
      if (!this.shouldShowAd && !this.isRouteExcluded && !this.isLocalhost) {
        await this.retryContentCheck()
      }
    },
    watch: {
      // Watch for route changes
      '$route.fullPath': {
        async handler() {
          // Reset state on route change
          this.isContentReady = false
          this.shouldShowAd = false
          this.contentCheckAttempts = 0

          // Wait a bit for new content to load
          await new Promise((resolve) => setTimeout(resolve, 100))

          // Re-evaluate
          await this.evaluateAdDisplay()

          if (!this.shouldShowAd && !this.isRouteExcluded && !this.isLocalhost) {
            await this.retryContentCheck()
          }
        }
      }
    },
    methods: {
      // Check if content is meaningful enough for ads
      async checkContentPresence(): Promise<boolean> {
        try {
          // Wait for DOM to be ready
          await nextTick()

          // Find the main content area - try multiple selectors
          const contentArea =
            (document.querySelector('main.content .section') as HTMLElement) ||
            (document.querySelector('main.content') as HTMLElement) ||
            (document.querySelector('.content .section') as HTMLElement)

          if (!contentArea) {
            console.log('SmartAdSense: No content area found')
            return false
          }

          // Get all text content from the main content area
          const textContent = contentArea.innerText || contentArea.textContent || ''
          const cleanText = textContent.replace(/\s+/g, ' ').trim()

          // Check for minimum content length
          if (cleanText.length < this.minContentLength) {
            console.log(`SmartAdSense: Content too short (${cleanText.length} chars, need ${this.minContentLength})`)
            return false
          }

          // Check for minimum number of sentences
          const sentences = cleanText.split(/[.!?]+/).filter((s) => s.trim().length > 10)
          if (sentences.length < this.minSentences) {
            console.log(`SmartAdSense: Not enough sentences (${sentences.length}, need ${this.minSentences})`)
            return false
          }

          // Check if there's a meaningful title (h1, h2, h3)
          const hasTitle = contentArea.querySelector('h1, h2, h3')
          if (!hasTitle) {
            console.log('SmartAdSense: No meaningful title found')
            return false
          }

          // Check if content is not just navigation/menu
          const navigationKeywords = ['menu', 'navigation', 'sidebar', 'nav', 'links']
          const isNavigationOnly = navigationKeywords.some(
            (keyword) => cleanText.toLowerCase().includes(keyword) && cleanText.length < 300
          )

          if (isNavigationOnly) {
            console.log('SmartAdSense: Content appears to be navigation-only')
            return false
          }

          // Additional check: ensure content has substantial paragraphs
          const paragraphs = contentArea.querySelectorAll('p')
          const meaningfulParagraphs = Array.from(paragraphs).filter((p) => (p.textContent || '').trim().length > 50)

          if (meaningfulParagraphs.length < 1) {
            console.log('SmartAdSense: No meaningful paragraphs found')
            return false
          }

          console.log('SmartAdSense: Content check passed', {
            length: cleanText.length,
            sentences: sentences.length,
            hasTitle: !!hasTitle,
            paragraphs: meaningfulParagraphs.length
          })

          return true
        } catch (error) {
          console.error('SmartAdSense: Error checking content presence', error)
          return false
        }
      },

      // Determine if ad should be shown
      async evaluateAdDisplay() {
        if (this.isLocalhost) {
          console.log('SmartAdSense: Localhost detected, not showing ads')
          this.shouldShowAd = false
          return
        }

        if (this.isRouteExcluded) {
          console.log('SmartAdSense: Route excluded from ads')
          this.shouldShowAd = false
          return
        }

        if (!this.adSlot) {
          console.log('SmartAdSense: No ad slot provided')
          this.shouldShowAd = false
          return
        }

        const hasContent = await this.checkContentPresence()
        this.shouldShowAd = hasContent
        this.isContentReady = true
      },

      // Retry content check with exponential backoff
      async retryContentCheck() {
        if (this.contentCheckAttempts >= this.maxContentCheckAttempts) {
          console.log('SmartAdSense: Max content check attempts reached')
          this.shouldShowAd = false
          this.isContentReady = true
          return
        }

        this.contentCheckAttempts++
        const delay = Math.min(1000 * Math.pow(2, this.contentCheckAttempts - 1), 5000)

        setTimeout(async () => {
          const hasContent = await this.checkContentPresence()
          if (hasContent) {
            this.shouldShowAd = true
            this.isContentReady = true
          } else {
            await this.retryContentCheck()
          }
        }, delay)
      },

      ensureScript(): Promise<void> {
        if (adsScriptAppended) return Promise.resolve()

        return new Promise((resolve) => {
          const s = document.createElement('script')
          s.async = true
          s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${this.adClient}`
          s.crossOrigin = 'anonymous'
          s.onload = () => resolve()
          document.head.appendChild(s)
          adsScriptAppended = true
        })
      },

      async pushAd() {
        if (!this.show) return

        try {
          await this.ensureScript()
          await nextTick()

          const ins = this.$el.querySelector('ins.adsbygoogle') as HTMLElement | null
          if (!ins) return

          // If Google added a data-adsbygoogle-status attr, it's already initialized
          if (ins.getAttribute('data-adsbygoogle-status')) return // @ts-ignore
          ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        } catch (e) {
          console.error('SmartAdSense: Ad push error', e)
        }
      }
    }
  })
</script>

<style lang="scss">
  .smart-adsense-container {
    margin: var(--spacing, 16px) 0;
    text-align: center;
    min-height: 90px; // Reserve space to prevent layout shift

    .ad-placeholder {
      padding: var(--spacing, 16px);
      border: 2px dashed #ccc;
      border-radius: 8px;
      color: #777;
      font-size: 14px;
      background-color: #f9f9f9;
    }

    .ad-loading {
      padding: var(--spacing, 16px);
      color: #666;
      font-size: 12px;
      font-style: italic;
    }

    // Ensure ads don't dominate on mobile
    @media (max-width: 768px) {
      margin: var(--spacing-half, 8px) 0;
      min-height: 60px;
    }
  }
</style>

<template>
  <div class="smart-adsense-container">
    <!-- Loading state -->
    <div v-if="!isContentReady && !isLocalhost && !isRouteExcluded" class="ad-loading">Checking content...</div>

    <!-- Placeholder for localhost/excluded routes -->
    <div v-else-if="!show" class="ad-placeholder">
      <strong>📢 Ad Placement</strong>
      <div v-if="isLocalhost">AdSense ad will display here (localhost)</div>
      <div v-else-if="isRouteExcluded">Ad blocked: {{ $route.path }} (excluded route)</div>
      <div v-else>Ad blocked: Insufficient content</div>
      <small>Ad format: {{ adFormat }} | Responsive: {{ String(fullWidthResponsive) }}</small>
    </div>

    <!-- Actual AdSense ad -->
    <ins
      v-else
      class="adsbygoogle"
      style="display: block"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="String(fullWidthResponsive)"
    />
  </div>
</template>
