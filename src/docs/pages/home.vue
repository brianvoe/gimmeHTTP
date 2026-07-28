<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '@/gimmehttp'
  import { Languages } from '@/gimmehttp/core'
  import { getLogo } from '@/gimmehttp/logos/index'

  import type { Http } from '@/gimmehttp/core'

  export default defineComponent({
    name: 'Home',
    data() {
      // Simple example request shown on the home page
      const homeHttp: Http = {
        method: 'POST',
        url: 'https://example.com/api/users',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          first_name: 'Billy',
          email: 'billyboy@gmail.com'
        }
      }

      return {
        homeHttp,
        selectedLanguage: '',
        instance: null as GimmeHTTP | null
      }
    },
    mounted() {
      this.instance = new GimmeHTTP({
        container: this.$refs.example as HTMLElement,
        settings: { http: this.homeHttp },
        events: {
          afterChange: (language) => {
            this.selectedLanguage = language
          }
        }
      })
    },
    unmounted() {
      this.instance?.destroy()
      this.instance = null
    },
    computed: {
      languages(): string[] {
        return Languages()
      }
    },
    methods: {
      logoSvg(name: string): string | null {
        return getLogo(name)
      },
      setLanguage(lang: string) {
        this.instance?.setLanguage(lang)
      }
    }
  })
</script>

<style lang="scss">
  .home {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1.5);

    .hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: calc(var(--spacing) * 3) var(--spacing) 0 var(--spacing);
      gap: var(--spacing);

      .hero_title {
        position: relative;
        display: inline-block;
        font-size: clamp(52px, 9vw, 88px);
        font-weight: 300;
        line-height: 1;
        letter-spacing: -2px;
        color: var(--color-heading);

        .accent {
          font-weight: 700;
          background: linear-gradient(120deg, var(--color-primary-bright) 0%, var(--color-primary-deep) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }

        .version {
          position: absolute;
          top: 0.14em;
          left: 100%;
          margin-left: 0.1em;
          font-size: 0.26em;
          font-weight: 600;
          letter-spacing: 0.08em;
          line-height: 1;
          text-transform: uppercase;
          color: var(--color-text-muted);
          white-space: nowrap;
          pointer-events: none;
        }
      }

      .hero_tagline {
        margin: 0;
        font-size: clamp(16px, 2.5vw, 20px);
        font-weight: 600;
        color: var(--color-heading);
      }
    }

    // compact language showcase — click to change the example below
    .languages_showcase {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-half);

      .langs {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--spacing-quarter);
        max-width: 420px;
        margin: 0 auto;

        .lang {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--spacing-quarter);
          border: solid 1px var(--color-border);
          border-radius: var(--border-radius);
          background-color: rgba(0, 0, 0, 0.2);
          cursor: pointer;
          transition:
            background-color var(--animation-timing),
            border-color var(--animation-timing);

          &.selected,
          &:hover {
            background-color: var(--color-surface-raised);
            border-color: var(--color-primary);
          }

          svg {
            width: 22px;
            height: 22px;
            user-select: none;
            display: block;
          }

          span.lang-name {
            padding: 0 var(--spacing-quarter);
            font-size: 12px;
            font-weight: 600;
            line-height: 22px;
            text-align: center;
            text-transform: capitalize;
            color: var(--color-text-muted);
          }
        }
      }
    }

    .home_example {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-half);

      .example {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
      }
    }

    .cta_row {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: var(--spacing);
      padding-bottom: var(--spacing);
    }
  }
</style>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero_title">
        gimme<span class="accent">HTTP</span>
        <span class="version" aria-hidden="true">v2</span>
      </div>
      <p class="hero_tagline">HTTP request code, in every language.</p>
    </section>

    <div class="languages_showcase">
      <div class="eyebrow">Available languages</div>
      <div class="langs">
        <div
          class="lang"
          :class="{ selected: lang === selectedLanguage }"
          v-for="lang in languages"
          :key="lang"
          @click="setLanguage(lang)"
        >
          <span v-if="logoSvg(lang)" v-html="logoSvg(lang)"></span>
          <span v-else class="lang-name">{{ lang }}</span>
        </div>
      </div>
    </div>

    <div class="home_example">
      <div class="eyebrow">See it in action</div>
      <div ref="example" class="example"></div>
    </div>

    <div class="cta_row">
      <router-link to="/demo" class="btn primary">Try the demo</router-link>
      <a href="https://github.com/brianvoe/gimmehttp" target="_blank" class="btn secondary">View on GitHub</a>
    </div>
  </div>
</template>
