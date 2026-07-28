<script lang="ts">
  import { defineComponent } from 'vue'

  const links = [
    { path: '/usage', label: 'Usage' },
    { path: '/settings', label: 'Settings' },
    { path: '/demo', label: 'Demo' },
    { path: '/style', label: 'Style' }
  ]

  const frameworkLinks = [
    { path: '/vue', label: 'Vue' },
    { path: '/react', label: 'React' }
  ]

  export default defineComponent({
    name: 'Header',
    data() {
      return {
        links,
        frameworkLinks,
        menuOpen: false,
        frameworksOpen: false
      }
    },
    computed: {
      frameworksActive(): boolean {
        return this.frameworkLinks.some((link) => this.$route.path === link.path)
      }
    },
    watch: {
      $route() {
        this.menuOpen = false
        this.frameworksOpen = false
      }
    },
    methods: {
      toggleMenu() {
        this.menuOpen = !this.menuOpen
        if (!this.menuOpen) {
          this.frameworksOpen = false
        }
      },
      closeMenu() {
        this.menuOpen = false
        this.frameworksOpen = false
      },
      toggleFrameworks() {
        this.frameworksOpen = !this.frameworksOpen
      },
      onFrameworksBlur(event: FocusEvent) {
        const next = event.relatedTarget as Node | null
        const root = this.$refs.frameworksDropdown as HTMLElement | undefined
        if (root && next && root.contains(next)) {
          return
        }
        this.frameworksOpen = false
      }
    }
  })
</script>

<style lang="scss">
  .header {
    /* positioning css is in layout.scss */

    .center {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      width: 100%;
      max-width: var(--content-width);
      gap: var(--spacing);
      box-sizing: border-box;

      .brand {
        margin: 0;
        font-size: 24px;
        font-weight: 300;
        letter-spacing: 0.5px;
        color: var(--color-heading);
        text-decoration: none;
        white-space: nowrap;

        .accent {
          font-weight: 700;
          color: var(--color-primary);
        }
      }

      nav {
        display: flex;
        align-items: center;
        gap: var(--spacing-quarter);

        a,
        .nav_dropdown_toggle {
          padding: 6px 12px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-muted);
          border-radius: var(--border-radius);
          text-decoration: none;
          transition:
            color var(--animation-timing),
            background-color var(--animation-timing);
        }

        a {
          &:hover {
            color: var(--color-heading);
          }

          &.active {
            color: var(--color-heading);
            background-color: var(--color-surface-raised);
          }
        }

        .nav_dropdown {
          position: relative;

          .nav_dropdown_toggle {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin: 0;
            border: none;
            background: transparent;
            cursor: pointer;
            font-family: inherit;
            line-height: inherit;

            .chevron {
              display: inline-block;
              font-size: 0.7rem;
              transition: transform 0.15s ease;
            }

            &:hover,
            &[aria-expanded='true'],
            &.active {
              color: var(--color-heading);
            }

            &.active {
              background-color: var(--color-surface-raised);
            }

            &[aria-expanded='true'] .chevron {
              transform: rotate(180deg);
            }
          }

          .nav_dropdown_menu {
            position: absolute;
            top: calc(100% + 6px);
            left: 0;
            z-index: 120;
            display: none;
            flex-direction: column;
            min-width: 9rem;
            padding: 6px;
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            background-color: rgba(23, 19, 16, 0.98);
            box-shadow: var(--box-shadow);
            backdrop-filter: blur(8px);

            a {
              padding: 8px 12px;
              white-space: nowrap;
            }
          }

          &.open .nav_dropdown_menu {
            display: flex;
          }
        }
      }

      .header_actions {
        display: flex;
        align-items: center;
        gap: var(--spacing);
        margin-left: auto;
      }

      .socials {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: var(--spacing);

        a {
          display: flex;
          align-items: center;
          color: var(--color-text-muted);
          transition: color var(--animation-timing);

          &:hover {
            color: var(--color-primary-bright);
          }

          svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
          }
        }
      }

      .menu_toggle {
        display: none;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius);
        background: transparent;
        color: var(--color-heading);
        cursor: pointer;
        transition:
          color var(--animation-timing),
          border-color var(--animation-timing),
          background-color var(--animation-timing);

        &:hover,
        &[aria-expanded='true'] {
          color: var(--color-primary-bright);
          border-color: var(--color-primary);
          background-color: var(--color-surface-raised);
        }

        svg {
          width: 22px;
          height: 22px;
          fill: currentColor;
        }
      }

      // Mobile: single-row header + slide-down nav panel
      @media screen and (max-width: 860px) {
        .menu_toggle {
          display: flex;
        }

        nav {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          flex-direction: column;
          align-items: stretch;
          gap: var(--spacing-quarter);
          padding: var(--spacing);
          background-color: rgba(23, 19, 16, 0.98);
          border-bottom: 1px solid var(--color-border);
          box-shadow: var(--box-shadow);
          backdrop-filter: blur(8px);

          &.open {
            display: flex;
          }

          a,
          .nav_dropdown_toggle {
            padding: 12px 14px;
            font-size: 15px;
          }

          .nav_dropdown {
            width: 100%;

            .nav_dropdown_toggle {
              width: 100%;
              justify-content: space-between;
            }

            .nav_dropdown_menu {
              position: static;
              top: auto;
              left: auto;
              min-width: 0;
              margin-top: 4px;
              box-shadow: none;
              border-color: var(--color-border);
              background-color: rgba(0, 0, 0, 0.25);
            }
          }
        }
      }
    }

    .menu_backdrop {
      display: none;

      @media screen and (max-width: 860px) {
        display: block;
        position: fixed;
        inset: var(--header-height) 0 0 0;
        z-index: 99;
        background: rgba(0, 0, 0, 0.45);
      }
    }
  }
</style>

<template>
  <div class="header">
    <div class="center">
      <router-link to="/" class="brand" @click="closeMenu">gimme<span class="accent">HTTP</span></router-link>

      <nav id="site-nav" :class="{ open: menuOpen }">
        <router-link v-for="link in links" :key="link.path" :to="link.path" @click="closeMenu">
          {{ link.label }}
        </router-link>

        <div
          ref="frameworksDropdown"
          class="nav_dropdown"
          :class="{ open: frameworksOpen }"
          @focusout="onFrameworksBlur"
        >
          <button
            type="button"
            class="nav_dropdown_toggle"
            :class="{ active: frameworksActive }"
            :aria-expanded="frameworksOpen ? 'true' : 'false'"
            aria-haspopup="true"
            aria-controls="frameworks-menu"
            @click.stop="toggleFrameworks"
          >
            Frameworks
            <span class="chevron" aria-hidden="true">▾</span>
          </button>
          <div id="frameworks-menu" class="nav_dropdown_menu" role="menu">
            <router-link
              v-for="link in frameworkLinks"
              :key="link.path"
              :to="link.path"
              role="menuitem"
              @click="closeMenu"
            >
              {{ link.label }}
            </router-link>
          </div>
        </div>
      </nav>

      <div class="header_actions">
        <div class="socials">
          <a href="https://github.com/brianvoe/gimmehttp" target="_blank" aria-label="GitHub">
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path
                d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
              />
            </svg>
          </a>
          <a href="https://www.npmjs.com/package/gimmehttp" target="_blank" aria-label="npm">
            <svg viewBox="0 0 18 7" aria-hidden="true">
              <path
                d="M0 0h18v6H9v1H5V6H0V0zm1 5h2V2h1v3h1V1H1v4zm5-4v5h2V5h2V1H6zm2 1h1v2H8V2zm3-1v4h2V2h1v3h1V2h1v3h1V1h-6z"
              />
            </svg>
          </a>
        </div>

        <button
          class="menu_toggle"
          type="button"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="site-nav"
          aria-label="Toggle navigation"
          @click="toggleMenu"
        >
          <svg v-if="!menuOpen" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16v2H4V7zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6.4 5l12.6 12.6-1.4 1.4L5 6.4 6.4 5zm12.6 1.4L6.4 19 5 17.6 17.6 5l1.4 1.4z" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="menuOpen" class="menu_backdrop" @click="closeMenu" />
  </div>
</template>
