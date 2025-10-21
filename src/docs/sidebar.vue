<script lang="ts">
  import { defineComponent } from 'vue'
  import AdSense from './components/adsense.vue'

  const links = [
    { path: '/', label: 'Overview' },
    { path: '/install', label: 'Install' },
    { path: '/settings', label: 'Settings' },
    { path: '/examples', label: 'Examples' },
    { path: '/vue', label: 'Vue' }
  ]

  export default defineComponent({
    name: 'DocsSidebar',
    components: {
      AdSense
    },
    data() {
      return {
        links
      }
    },
    methods: {
      navigate(path: string) {
        this.$router.push(path)
      }
    }
  })
</script>

<style lang="scss">
  .sidebar {
    position: sticky;
    top: 0;
    flex: 0 1 200px;
    max-width: 200px;
    padding: var(--spacing);
    border-radius: var(--border-radius);
    background-color: var(--color-section-bg);
    box-shadow: var(--box-shadow);

    nav {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);

      button {
        appearance: none;
        border: 0;
        background: transparent;
        text-align: left;
        font-weight: bold;
        color: var(--color-text);
        padding: var(--spacing-quarter) 0;
        cursor: pointer;
        transition:
          color var(--animation-timing) ease,
          transform var(--animation-timing) ease;

        &:hover {
          color: var(--accent-color);
          transform: translateX(5px) scale(1.05);
        }
      }
    }
  }
</style>

<template>
  <aside class="sidebar">
    <nav>
      <button v-for="link in links" :key="link.path" type="button" @click="navigate(link.path)">
        {{ link.label }}
      </button>
    </nav>
    <AdSense adSlot="9560132183" />
  </aside>
</template>
