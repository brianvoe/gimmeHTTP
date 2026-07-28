<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '@/gimmehttp'
  import HighlightStyle from '@/docs/components/highlight_style.vue'
  import type { Http } from '@/gimmehttp/core'

  const demoHttp: Http = {
    method: 'POST',
    url: 'https://api.example.com/users',
    headers: { 'Content-Type': 'application/json' },
    body: { name: 'Ada', role: 'admin' }
  }

  export default defineComponent({
    name: 'StylePage',
    components: { HighlightStyle },
    data() {
      return {
        demoHttp,
        instances: [] as GimmeHTTP[]
      }
    },
    mounted() {
      const mounts: Array<[string, 'dark' | 'light' | undefined]> = [
        ['styleDefault', 'dark'],
        ['styleFlat', 'dark'],
        ['styleOcean', 'dark'],
        ['styleLight', 'light']
      ]

      this.instances = mounts.map(([ref, theme]) => {
        return new GimmeHTTP({
          container: this.$refs[ref] as HTMLElement,
          settings: {
            language: 'javascript',
            client: 'fetch',
            ...(theme ? { theme } : {}),
            http: this.demoHttp
          }
        })
      })
    },
    unmounted() {
      this.instances.forEach((instance) => instance.destroy())
      this.instances = []
    }
  })
</script>

<style lang="scss">
  .style-page {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);

    .style-demo {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);

      .style-demo-label {
        font-size: 13px;
        font-weight: 700;
        color: var(--color-text-muted);
      }

      .style-demo-widget {
        min-height: 220px;
      }
    }

    // Example themes — beat library dark defaults; leave .light alone
    .theme-flat .gimmehttp:not(.light) {
      --gh-radius: 0;
      --gh-shadow: none;
      --gh-accent: #e6edf3;
      --gh-border: #484f58;
      --gh-surface: #161b22;
      --gh-hover: #21262d;
      --gh-bg: #0d1117;
    }

    .theme-ocean .gimmehttp:not(.light) {
      --gh-bg: #0b1220;
      --gh-fg: #d7e3f4;
      --gh-muted: #7f95b3;
      --gh-border: #243447;
      --gh-accent: #3dd6c6;
      --gh-surface: #122033;
      --gh-hover: #1a2d48;
      --gh-kw: #7aa2f7;
      --gh-fn: #bb9af7;
      --gh-const: #7dcfff;
      --gh-str: #9ece6a;
      --gh-var: #e0af68;
      --gh-cmt: #565f89;
      --gh-tag: #73daca;
    }
  }
</style>

<template>
  <div class="section style-page">
    <header>
      <h2>Style</h2>
      <p>
        Docs demos use GimmeHTTP's default look so you see exactly what ships. Theme the widget by overriding CSS
        variables on <code>.gimmehttp</code> — no rebuild required.
      </p>
    </header>

    <h3>Default</h3>
    <p>Out of the box dark theme (toggle the sun/moon for light).</p>
    <div class="style-demo">
      <div ref="styleDefault" class="style-demo-widget"></div>
    </div>

    <h3>Override with CSS variables</h3>
    <p>Point variables at a wrapper (or the widget itself). Only set what you want to change.</p>
    <HighlightStyle language="css">
      <pre>
        .my-theme .gimmehttp {
          --gh-bg: #0b1220;
          --gh-fg: #d7e3f4;
          --gh-accent: #3dd6c6;
          --gh-surface: #122033;
          --gh-border: #243447;
          --gh-kw: #7aa2f7;
          --gh-str: #9ece6a;
        }
      </pre>
    </HighlightStyle>

    <div class="style-demo">
      <div class="style-demo-label">Ocean</div>
      <div ref="styleOcean" class="style-demo-widget theme-ocean"></div>
    </div>

    <div class="style-demo">
      <div class="style-demo-label">Flat / minimal</div>
      <div ref="styleFlat" class="style-demo-widget theme-flat"></div>
    </div>

    <div class="style-demo">
      <div class="style-demo-label">Built-in light theme</div>
      <div ref="styleLight" class="style-demo-widget"></div>
    </div>

    <h3>Variables</h3>
    <p>All defaults live on <code>.gimmehttp</code>. Light mode resets the same set via <code>.gimmehttp.light</code>.</p>

    <h4>Chrome</h4>
    <HighlightStyle language="css">
      <pre>
        --gh-bg       /* code + panel background */
        --gh-fg       /* primary text / icons */
        --gh-muted    /* secondary text */
        --gh-border   /* borders */
        --gh-accent   /* selection / copied / accents */
        --gh-surface  /* options bar + modal panel */
        --gh-hover    /* button / option hover fill */
        --gh-overlay  /* language modal backdrop */
        --gh-radius   /* outer + modal radius */
        --gh-shadow   /* outer + dropdown + modal shadow */
      </pre>
    </HighlightStyle>

    <h4>Syntax</h4>
    <HighlightStyle language="css">
      <pre>
        --gh-kw     /* keywords */
        --gh-fn     /* functions / titles */
        --gh-const  /* numbers, attrs, constants */
        --gh-str    /* strings */
        --gh-var    /* built-ins / symbols */
        --gh-cmt    /* comments */
        --gh-tag    /* tags / names */
      </pre>
    </HighlightStyle>
  </div>
</template>
