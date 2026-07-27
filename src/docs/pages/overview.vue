<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHttp } from '@/gimmehttp/vue'
  import { Languages } from '../../gimmehttp'
  import { getLogo } from '@/gimmehttp/logos/index'

  import type { Http } from '../../gimmehttp'

  export default defineComponent({
    name: 'Overview',
    components: { GimmeHttp },
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
        homeHttp
      }
    },
    computed: {
      languages(): string[] {
        return Languages()
      }
    },
    methods: {
      logoSvg(name: string): string | null {
        return getLogo(name)
      }
    }
  })
</script>

<style lang="scss">
  .overview {
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
      }

      .hero_tagline {
        margin: 0;
        font-size: clamp(16px, 2.5vw, 20px);
        font-weight: 600;
        color: var(--color-heading);
      }
    }

    // compact, non-interactive language showcase
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
        max-width: 640px;
        margin: 0 auto;

        .lang {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: var(--spacing-quarter);
          border: solid 1px var(--color-border);
          border-radius: var(--border-radius);
          background-color: rgba(0, 0, 0, 0.2);

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

      .gimmehttp {
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
  <div class="overview">
    <section class="hero">
      <div class="hero_title">gimme<span class="accent">HTTP</span></div>
      <p class="hero_tagline">HTTP request code, in every language.</p>
    </section>

    <div class="languages_showcase">
      <div class="eyebrow">Available languages</div>
      <div class="langs">
        <div class="lang" v-for="lang in languages" :key="lang">
          <span v-if="logoSvg(lang)" v-html="logoSvg(lang)"></span>
          <span v-else class="lang-name">{{ lang }}</span>
        </div>
      </div>
    </div>

    <div class="home_example">
      <div class="eyebrow">See it in action</div>
      <GimmeHttp :http="homeHttp" />
    </div>

    <div class="cta_row">
      <router-link to="/demo" class="btn primary">Try the demo</router-link>
      <a href="https://github.com/brianvoe/gimmehttp" target="_blank" class="btn secondary">View on GitHub</a>
    </div>
  </div>
</template>
