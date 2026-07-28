<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '@/gimmehttp'
  import type { Http } from '@/gimmehttp/core'

  const demoHttp: Http = {
    method: 'POST',
    url: 'https://api.example.com/users',
    headers: { 'Content-Type': 'application/json' },
    body: { name: 'Ada', role: 'admin' }
  }

  type VarField = {
    name: string
    desc: string
    type: 'color' | 'text'
  }

  const chromeVars: VarField[] = [
    { name: '--gh-bg', desc: 'Code + panel background', type: 'color' },
    { name: '--gh-fg', desc: 'Primary text / icons', type: 'color' },
    { name: '--gh-muted', desc: 'Secondary text', type: 'color' },
    { name: '--gh-border', desc: 'Borders', type: 'color' },
    { name: '--gh-accent', desc: 'Selection / copied / accents', type: 'color' },
    { name: '--gh-surface', desc: 'Options bar + modal panel', type: 'color' },
    { name: '--gh-hover', desc: 'Button / option hover fill', type: 'color' },
    { name: '--gh-overlay', desc: 'Language modal backdrop', type: 'text' },
    { name: '--gh-radius', desc: 'Outer + modal radius', type: 'text' },
    { name: '--gh-shadow', desc: 'Outer + dropdown + modal shadow', type: 'text' }
  ]

  const syntaxVars: VarField[] = [
    { name: '--gh-kw', desc: 'Keywords', type: 'color' },
    { name: '--gh-fn', desc: 'Functions / titles', type: 'color' },
    { name: '--gh-const', desc: 'Numbers, attrs, constants', type: 'color' },
    { name: '--gh-str', desc: 'Strings', type: 'color' },
    { name: '--gh-var', desc: 'Built-ins / symbols', type: 'color' },
    { name: '--gh-cmt', desc: 'Comments', type: 'color' },
    { name: '--gh-tag', desc: 'Tags / names', type: 'color' }
  ]

  const darkDefaults: Record<string, string> = {
    '--gh-bg': '#1a1918',
    '--gh-fg': '#e8e6e3',
    '--gh-muted': '#9a9690',
    '--gh-border': '#33312e',
    '--gh-accent': '#ff9122',
    '--gh-surface': '#22211f',
    '--gh-hover': '#2c2a27',
    '--gh-overlay': 'rgba(0, 0, 0, 0.5)',
    '--gh-radius': '8px',
    '--gh-shadow': '0 4px 12px rgba(0, 0, 0, 0.45)',
    '--gh-kw': '#ff7b72',
    '--gh-fn': '#d2a8ff',
    '--gh-const': '#79c0ff',
    '--gh-str': '#a5d6ff',
    '--gh-var': '#ffa657',
    '--gh-cmt': '#8b949e',
    '--gh-tag': '#7ee787'
  }

  const lightDefaults: Record<string, string> = {
    '--gh-bg': '#ffffff',
    '--gh-fg': '#1f2328',
    '--gh-muted': '#656d76',
    '--gh-border': '#d0d7de',
    '--gh-accent': '#ff9122',
    '--gh-surface': '#f6f8fa',
    '--gh-hover': '#eaeef2',
    '--gh-overlay': 'rgba(31, 35, 40, 0.4)',
    '--gh-radius': '8px',
    '--gh-shadow': '0 1px 3px rgba(31, 35, 40, 0.12)',
    '--gh-kw': '#cf222e',
    '--gh-fn': '#8250df',
    '--gh-const': '#0550ae',
    '--gh-str': '#0a3069',
    '--gh-var': '#953800',
    '--gh-cmt': '#57606a',
    '--gh-tag': '#116329'
  }

  function toColorInput(value: string): string {
    const hex = value.trim()
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      return hex.toLowerCase()
    }
    if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
      const r = hex[1]
      const g = hex[2]
      const b = hex[3]
      return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
    }
    return '#000000'
  }

  const themeExamples = [
    { id: 'ocean', label: 'Ocean', blurb: 'Cool teal and deep blues', mode: 'dark' as const },
    { id: 'flat', label: 'Flat', blurb: 'Minimal, sharp edges, no shadow', mode: 'dark' as const },
    { id: 'professional', label: 'Professional', blurb: 'Restrained slate for docs and dashboards', mode: 'dark' as const },
    { id: 'cool', label: 'Cool', blurb: 'Icy frost with cyan accents', mode: 'dark' as const },
    { id: 'terminal', label: 'Terminal', blurb: 'Classic phosphor green CRT vibes', mode: 'dark' as const },
    { id: 'noir', label: 'Noir', blurb: 'High-contrast black, white, and crimson', mode: 'dark' as const },
    { id: 'ember', label: 'Ember', blurb: 'Warm charcoal with molten orange', mode: 'dark' as const },
    { id: 'wacky', label: 'Wacky', blurb: 'Loud magenta, lime, and comic energy', mode: 'dark' as const },
    { id: 'extreme', label: 'Extreme', blurb: 'Neon cyberpunk overload', mode: 'dark' as const },
    { id: 'candy', label: 'Candy', blurb: 'Soft pastel light theme', mode: 'light' as const },
    { id: 'paper', label: 'Paper', blurb: 'Clean light editorial look', mode: 'light' as const },
    { id: 'midnight', label: 'Midnight', blurb: 'Deep violet night sky', mode: 'dark' as const }
  ]

  export default defineComponent({
    name: 'StylePage',
    data() {
      return {
        demoHttp,
        chromeVars,
        syntaxVars,
        themeExamples,
        previewTheme: 'dark' as 'dark' | 'light',
        darkValues: { ...darkDefaults } as Record<string, string>,
        lightValues: { ...lightDefaults } as Record<string, string>,
        chromeOpen: true,
        syntaxOpen: true,
        cssCopied: false,
        copyTimeout: null as ReturnType<typeof setTimeout> | null,
        playground: null as GimmeHTTP | null,
        instances: [] as GimmeHTTP[],
        exampleEls: {} as Record<string, HTMLElement>
      }
    },
    computed: {
      themeValues(): Record<string, string> {
        return this.previewTheme === 'light' ? this.lightValues : this.darkValues
      },
      cssOutput(): string {
        const selector =
          this.previewTheme === 'light' ? '.my-theme .gimmehttp.light' : '.my-theme .gimmehttp'
        const lines = Object.entries(this.themeValues).map(([name, value]) => `  ${name}: ${value};`)
        return `${selector} {\n${lines.join('\n')}\n}`
      },
      cssOutputRows(): number {
        return this.cssOutput.split('\n').length
      }
    },
    watch: {
      darkValues: {
        deep: true,
        handler() {
          if (this.previewTheme === 'dark') {
            this.applyPreviewVars()
          }
        }
      },
      lightValues: {
        deep: true,
        handler() {
          if (this.previewTheme === 'light') {
            this.applyPreviewVars()
          }
        }
      },
      previewTheme() {
        this.playground?.setTheme(this.previewTheme)
        this.$nextTick(() => this.applyPreviewVars())
      }
    },
    mounted() {
      this.playground = new GimmeHTTP({
        container: this.$refs.playgroundPreview as HTMLElement,
        settings: {
          language: 'javascript',
          client: 'fetch',
          theme: 'dark',
          // Theme is controlled by the playground toggle
          copy: true,
          picker: true,
          http: this.demoHttp
        }
      })
      this.applyPreviewVars()

      this.$nextTick(() => {
        this.instances = this.themeExamples.map((ex) => {
          const container = this.exampleEls[ex.id]
          if (!container) {
            throw new Error(`Style example mount missing: ${ex.id}`)
          }
          return new GimmeHTTP({
            container,
            settings: {
              language: 'javascript',
              client: 'fetch',
              theme: ex.mode,
              http: this.demoHttp
            }
          })
        })
      })
    },
    unmounted() {
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout)
      }
      this.playground?.destroy()
      this.playground = null
      this.instances.forEach((instance) => instance.destroy())
      this.instances = []
    },
    methods: {
      setExampleRef(id: string, el: Element | null) {
        if (el) {
          this.exampleEls[id] = el as HTMLElement
        } else {
          delete this.exampleEls[id]
        }
      },
      applyPreviewVars() {
        const root = (this.$refs.playgroundPreview as HTMLElement | undefined)?.querySelector(
          '.gimmehttp'
        ) as HTMLElement | null
        if (!root) {
          return
        }
        for (const [name, value] of Object.entries(this.themeValues)) {
          root.style.setProperty(name, value)
        }
      },
      setVar(name: string, value: string) {
        if (this.previewTheme === 'light') {
          this.lightValues[name] = value
        } else {
          this.darkValues[name] = value
        }
      },
      colorInputValue(name: string): string {
        return toColorInput(this.themeValues[name] || '#000000')
      },
      onColorPick(name: string, event: Event) {
        this.setVar(name, (event.target as HTMLInputElement).value)
      },
      onTextInput(name: string, event: Event) {
        this.setVar(name, (event.target as HTMLInputElement).value)
      },
      setPreviewTheme(theme: 'dark' | 'light') {
        this.previewTheme = theme
      },
      toggleChrome() {
        this.chromeOpen = !this.chromeOpen
      },
      toggleSyntax() {
        this.syntaxOpen = !this.syntaxOpen
      },
      resetTheme() {
        if (this.previewTheme === 'light') {
          this.lightValues = { ...lightDefaults }
        } else {
          this.darkValues = { ...darkDefaults }
        }
      },
      async copyCss() {
        try {
          await navigator.clipboard.writeText(this.cssOutput)
          this.cssCopied = true
          if (this.copyTimeout) {
            clearTimeout(this.copyTimeout)
          }
          this.copyTimeout = setTimeout(() => {
            this.cssCopied = false
          }, 1500)
        } catch {
          const area = this.$refs.cssOutput as HTMLTextAreaElement | undefined
          if (area) {
            area.focus()
            area.select()
          }
        }
      }
    }
  })
</script>

<style lang="scss">
  .style-page {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1.5);
    width: 100%;

    > .section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
    }

    .playground {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
      gap: var(--spacing);
      align-items: start;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .playground_controls {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
      min-width: 0;
      padding: var(--spacing);
      border: solid 1px var(--color-border);
      border-radius: var(--border-radius);
      background-color: rgba(0, 0, 0, 0.2);
      box-sizing: border-box;

      .controls_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-half);

        h4 {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--color-primary);
        }

        button {
          padding: 6px 12px;
          font-size: 13px;
        }
      }

      .field_group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-half);

        .field_group_toggle {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 6px;
          width: 100%;
          margin: 0;
          padding: 6px 0;
          border: none;
          border-radius: 0;
          background: transparent;
          color: inherit;
          cursor: pointer;
          text-align: left;

          h4 {
            margin: 0;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: var(--color-primary);
          }

          .chevron {
            flex: 0 0 auto;
            font-size: 0.75rem;
            color: var(--color-primary);
            transition: transform 0.15s ease;

            &.open {
              transform: rotate(90deg);
            }
          }

          &:hover h4,
          &:hover .chevron {
            color: var(--color-primary-bright);
          }
        }

        .field_group_body {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
      }

      .field {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(6.5rem, 1fr);
        gap: var(--spacing-half);
        align-items: center;

        &.text_only {
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
        }

        .field_meta {
          display: flex;
          flex-direction: column;
          gap: 1px;
          min-width: 0;

          code {
            font-size: 0.8rem;
            color: var(--color-primary-bright);
          }

          span {
            font-size: 0.72rem;
            color: var(--color-text-muted);
            line-height: 1.2;
          }
        }

        input[type='color'] {
          width: 2rem;
          height: 2rem;
          padding: 0;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--border-radius);
          background: transparent;
          cursor: pointer;
        }

        input[type='text'] {
          width: 100%;
          min-width: 0;
          font-size: 0.8rem;
          padding: 6px 8px;
        }
      }
    }

    .playground_live {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
      min-width: 0;
      position: sticky;
      top: calc(var(--header-height) + var(--spacing));

      @media (max-width: 900px) {
        position: static;
      }
    }

    .playground_preview {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);
      flex: 1 1 auto;
      min-height: 0;

      .preview_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-half);

        .style-demo-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-muted);
        }
      }

      .theme_toggle {
        display: inline-flex;
        border: 1px solid var(--color-border-strong);
        border-radius: var(--border-radius);
        overflow: hidden;

        button {
          padding: 6px 12px;
          font-size: 13px;
          border: none;
          border-radius: 0;
          background: transparent;

          &.active {
            color: #1c1610;
            background-color: var(--color-primary);
          }
        }
      }

      .style-demo-widget {
        min-height: 22rem;
        height: 22rem;

        > div {
          height: 100%;
        }
      }
    }

    .css_output {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);

      .css_output_header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-half);

        h4 {
          margin: 0;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--color-primary);
        }

        button {
          padding: 6px 12px;
          font-size: 13px;
        }
      }

      textarea {
        width: 100%;
        min-height: 0;
        box-sizing: border-box;
        resize: vertical;
        font-family: var(--font-mono);
        font-size: 0.8rem;
        line-height: 1.4;
      }
    }

    .examples {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing);

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .style-demo {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);
      min-width: 0;

      .style-demo-label {
        font-size: 13px;
        font-weight: 700;
        color: var(--color-text-muted);
      }

      .style-demo-blurb {
        margin: 0;
        font-size: 0.85rem;
        color: var(--color-text-muted);
        opacity: 0.85;
      }

      .style-demo-widget {
        min-height: 220px;
      }
    }

    // Example themes — beat library defaults for .gimmehttp
    .theme-ocean .gimmehttp {
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

    .theme-flat .gimmehttp {
      --gh-radius: 0;
      --gh-shadow: none;
      --gh-accent: #e6edf3;
      --gh-border: #484f58;
      --gh-surface: #161b22;
      --gh-hover: #21262d;
      --gh-bg: #0d1117;
    }

    .theme-professional .gimmehttp {
      --gh-bg: #12151a;
      --gh-fg: #e8eaed;
      --gh-muted: #8b93a7;
      --gh-border: #2a3140;
      --gh-accent: #5b8def;
      --gh-surface: #1a1f29;
      --gh-hover: #242b38;
      --gh-radius: 6px;
      --gh-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      --gh-kw: #7eb0ff;
      --gh-fn: #c3a6ff;
      --gh-const: #89d3ff;
      --gh-str: #9ddeb0;
      --gh-var: #f0c674;
      --gh-cmt: #6b7385;
      --gh-tag: #7ec8a3;
    }

    .theme-cool .gimmehttp {
      --gh-bg: #0a1628;
      --gh-fg: #eaf6ff;
      --gh-muted: #7eb0d0;
      --gh-border: #1e3a55;
      --gh-accent: #4de1ff;
      --gh-surface: #102238;
      --gh-hover: #183250;
      --gh-shadow: 0 0 24px rgba(77, 225, 255, 0.12);
      --gh-kw: #6ecbff;
      --gh-fn: #a8eaff;
      --gh-const: #5ce1e6;
      --gh-str: #9ef0c8;
      --gh-var: #ffe08a;
      --gh-cmt: #4d6f8a;
      --gh-tag: #7ef0d8;
    }

    .theme-terminal .gimmehttp {
      --gh-bg: #0a0f0a;
      --gh-fg: #33ff66;
      --gh-muted: #1fa644;
      --gh-border: #145c28;
      --gh-accent: #66ff99;
      --gh-surface: #0f1a0f;
      --gh-hover: #142414;
      --gh-radius: 2px;
      --gh-shadow: none;
      --gh-kw: #33ff66;
      --gh-fn: #99ffbb;
      --gh-const: #66ff99;
      --gh-str: #b8ffd0;
      --gh-var: #eeff00;
      --gh-cmt: #1a8033;
      --gh-tag: #55ee88;
    }

    .theme-noir .gimmehttp {
      --gh-bg: #000000;
      --gh-fg: #f5f5f5;
      --gh-muted: #888888;
      --gh-border: #333333;
      --gh-accent: #ff2a2a;
      --gh-surface: #111111;
      --gh-hover: #1c1c1c;
      --gh-radius: 0;
      --gh-shadow: 0 0 0 1px #ff2a2a33;
      --gh-kw: #ff2a2a;
      --gh-fn: #ffffff;
      --gh-const: #ff6b6b;
      --gh-str: #e0e0e0;
      --gh-var: #ffd0d0;
      --gh-cmt: #555555;
      --gh-tag: #ff8888;
    }

    .theme-ember .gimmehttp {
      --gh-bg: #1a100c;
      --gh-fg: #ffe8d6;
      --gh-muted: #b8896e;
      --gh-border: #4a2c1e;
      --gh-accent: #ff6a1a;
      --gh-surface: #24160f;
      --gh-hover: #332016;
      --gh-shadow: 0 8px 28px rgba(255, 106, 26, 0.18);
      --gh-kw: #ff7a45;
      --gh-fn: #ffb347;
      --gh-const: #ffd166;
      --gh-str: #f4a261;
      --gh-var: #e9c46a;
      --gh-cmt: #7a5340;
      --gh-tag: #e76f51;
    }

    .theme-wacky .gimmehttp {
      --gh-bg: #1b0620;
      --gh-fg: #fff5ff;
      --gh-muted: #d48adf;
      --gh-border: #6b1f7a;
      --gh-accent: #ff3dce;
      --gh-surface: #2a0a33;
      --gh-hover: #3d114a;
      --gh-radius: 18px;
      --gh-shadow: 8px 8px 0 #b8ff3d;
      --gh-kw: #ff3dce;
      --gh-fn: #b8ff3d;
      --gh-const: #55f0ff;
      --gh-str: #ffe566;
      --gh-var: #ff9f1c;
      --gh-cmt: #9a5aa8;
      --gh-tag: #7dffb3;
    }

    .theme-extreme .gimmehttp {
      --gh-bg: #050010;
      --gh-fg: #f8f7ff;
      --gh-muted: #9b8dff;
      --gh-border: #ff00e5;
      --gh-accent: #00ff9c;
      --gh-surface: #120024;
      --gh-hover: #1d0038;
      --gh-radius: 0;
      --gh-shadow: 0 0 18px #ff00e5, 0 0 36px #00ff9c55;
      --gh-kw: #ff00e5;
      --gh-fn: #00f0ff;
      --gh-const: #00ff9c;
      --gh-str: #ffe600;
      --gh-var: #ff6a00;
      --gh-cmt: #5c4d8a;
      --gh-tag: #7cff6b;
    }

    .theme-candy .gimmehttp {
      --gh-bg: #fff7fb;
      --gh-fg: #4a2c45;
      --gh-muted: #a87898;
      --gh-border: #f0cfe3;
      --gh-accent: #ff5fa2;
      --gh-surface: #ffe9f3;
      --gh-hover: #ffd6ea;
      --gh-overlay: rgba(74, 44, 69, 0.25);
      --gh-radius: 14px;
      --gh-shadow: 0 6px 20px rgba(255, 95, 162, 0.18);
      --gh-kw: #d63384;
      --gh-fn: #9b59b6;
      --gh-const: #3498db;
      --gh-str: #e67e22;
      --gh-var: #e74c3c;
      --gh-cmt: #b08aa0;
      --gh-tag: #1abc9c;
    }

    .theme-paper .gimmehttp {
      --gh-bg: #fbfbfd;
      --gh-fg: #1c2333;
      --gh-muted: #6b7385;
      --gh-border: #d8dee9;
      --gh-accent: #2f6fed;
      --gh-surface: #f1f4f9;
      --gh-hover: #e6ebf4;
      --gh-overlay: rgba(28, 35, 51, 0.28);
      --gh-radius: 4px;
      --gh-shadow: 0 1px 2px rgba(28, 35, 51, 0.08);
      --gh-kw: #0b57d0;
      --gh-fn: #683ab7;
      --gh-const: #1967d2;
      --gh-str: #0d652d;
      --gh-var: #b06000;
      --gh-cmt: #80868b;
      --gh-tag: #137333;
    }

    .theme-midnight .gimmehttp {
      --gh-bg: #0d0618;
      --gh-fg: #efe9ff;
      --gh-muted: #9b8ec4;
      --gh-border: #3d2a66;
      --gh-accent: #b388ff;
      --gh-surface: #160b28;
      --gh-hover: #22123a;
      --gh-shadow: 0 10px 40px rgba(99, 50, 180, 0.35);
      --gh-kw: #d4a5ff;
      --gh-fn: #9f7aea;
      --gh-const: #90cdf4;
      --gh-str: #68d391;
      --gh-var: #f6ad55;
      --gh-cmt: #6b5b8c;
      --gh-tag: #4fd1c5;
    }
  }
</style>

<template>
  <div class="style-page">
    <div class="section">
      <h2>Theme playground</h2>
      <p>
        Edit any <code>--gh-*</code> variable and see the widget update live. Switch dark/light, then copy the CSS for
        your site.
      </p>

      <div class="playground">
        <div class="playground_controls">
          <div class="controls_header">
            <h4>Variables</h4>
            <button type="button" @click="resetTheme">Reset</button>
          </div>

          <div class="field_group">
            <button
              type="button"
              class="field_group_toggle"
              :aria-expanded="chromeOpen"
              @click="toggleChrome"
            >
              <h4>Chrome</h4>
              <span class="chevron" :class="{ open: chromeOpen }" aria-hidden="true">▸</span>
            </button>
            <div v-show="chromeOpen" class="field_group_body">
              <div
                v-for="v in chromeVars"
                :key="v.name"
                class="field"
                :class="{ text_only: v.type === 'text' }"
              >
                <div class="field_meta">
                  <code>{{ v.name }}</code>
                  <span>{{ v.desc }}</span>
                </div>
                <input
                  v-if="v.type === 'color'"
                  type="color"
                  :value="colorInputValue(v.name)"
                  :aria-label="v.name"
                  @input="onColorPick(v.name, $event)"
                />
                <input
                  type="text"
                  :value="themeValues[v.name]"
                  :aria-label="`${v.name} value`"
                  spellcheck="false"
                  @input="onTextInput(v.name, $event)"
                />
              </div>
            </div>
          </div>

          <div class="field_group">
            <button
              type="button"
              class="field_group_toggle"
              :aria-expanded="syntaxOpen"
              @click="toggleSyntax"
            >
              <h4>Syntax</h4>
              <span class="chevron" :class="{ open: syntaxOpen }" aria-hidden="true">▸</span>
            </button>
            <div v-show="syntaxOpen" class="field_group_body">
              <div v-for="v in syntaxVars" :key="v.name" class="field">
                <div class="field_meta">
                  <code>{{ v.name }}</code>
                  <span>{{ v.desc }}</span>
                </div>
                <input
                  type="color"
                  :value="colorInputValue(v.name)"
                  :aria-label="v.name"
                  @input="onColorPick(v.name, $event)"
                />
                <input
                  type="text"
                  :value="themeValues[v.name]"
                  :aria-label="`${v.name} value`"
                  spellcheck="false"
                  @input="onTextInput(v.name, $event)"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="playground_live">
          <div class="playground_preview">
            <div class="preview_header">
              <div class="style-demo-label">Live preview</div>
              <div class="theme_toggle" role="group" aria-label="Preview theme">
                <button
                  type="button"
                  :class="{ active: previewTheme === 'dark' }"
                  @click="setPreviewTheme('dark')"
                >
                  Dark
                </button>
                <button
                  type="button"
                  :class="{ active: previewTheme === 'light' }"
                  @click="setPreviewTheme('light')"
                >
                  Light
                </button>
              </div>
            </div>
            <div class="style-demo-widget">
              <div ref="playgroundPreview"></div>
            </div>
          </div>

          <div class="css_output">
            <div class="css_output_header">
              <h4>CSS output</h4>
              <button type="button" @click="copyCss">
                {{ cssCopied ? 'Copied' : 'Copy' }}
              </button>
            </div>
            <textarea
              ref="cssOutput"
              readonly
              :value="cssOutput"
              :rows="cssOutputRows"
              spellcheck="false"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h3>Examples</h3>
      <p>Same widget, restyled with different CSS variables — from professional to extreme.</p>

      <div class="examples">
        <div v-for="ex in themeExamples" :key="ex.id" class="style-demo">
          <div class="style-demo-label">{{ ex.label }}</div>
          <p class="style-demo-blurb">{{ ex.blurb }}</p>
          <div
            class="style-demo-widget"
            :class="`theme-${ex.id}`"
            :ref="(el) => setExampleRef(ex.id, el as Element | null)"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
