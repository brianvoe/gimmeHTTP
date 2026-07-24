<script lang="ts">
  import { defineComponent } from 'vue'

  const links = [
    { path: '/', label: 'Overview' },
    { path: '/install', label: 'Install' },
    { path: '/settings', label: 'Settings' },
    { path: '/examples', label: 'Examples' },
    { path: '/vue', label: 'Vue' }
  ]

  export default defineComponent({
    name: 'Header',
    data() {
      return {
        links
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
      flex-wrap: wrap;
      margin: 0 auto;
      width: 100%;
      max-width: var(--content-width);
      row-gap: 0;
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

        a {
          padding: 6px 12px;
          font-size: 14px;
          font-weight: 600;
          color: var(--color-text-muted);
          border-radius: var(--border-radius);
          text-decoration: none;
          transition:
            color var(--animation-timing),
            background-color var(--animation-timing);

          &:hover {
            color: var(--color-heading);
          }

          &.active {
            color: var(--color-heading);
            background-color: var(--color-surface-raised);
          }
        }
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

      // two-row header on small screens: brand + socials on top, nav below
      @media screen and (max-width: 700px) {
        nav {
          order: 3;
          width: 100%;
          justify-content: center;
          gap: 0;

          a {
            padding: 5px 8px;
            font-size: 13px;
            white-space: nowrap;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="header">
    <div class="center">
      <router-link to="/" class="brand">gimme<span class="accent">HTTP</span></router-link>
      <nav>
        <router-link v-for="link in links" :key="link.path" :to="link.path">
          {{ link.label }}
        </router-link>
      </nav>
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
    </div>
  </div>
</template>
