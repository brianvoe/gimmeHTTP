<script lang="ts">
  import { defineComponent } from 'vue'
  import Install from './install.vue'
  import Simple from './simple.vue'

  import VueShiki from '../components/vue_shiki.vue'

  export default defineComponent({
    name: 'Home',
    components: {
      Install,
      Simple
    },
    data() {
      return {}
    }
  })
</script>

<style lang="scss">
  .docs {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: var(--spacing);
    width: 100%;
    min-width: 400px;
    max-width: 800px;
    background-color: var(--color-bg);
    color: var(--color-text);

    .section {
      background-color: var(--color-section-bg);
      padding: var(--spacing);
      width: 100%;
      max-width: 800px;
      border-radius: var(--border-radius);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    }
  }
</style>

<template>
  <div class="docs">
    <div class="section">
      <p>This is the documentation for the GimmeHttp package.</p>
    </div>

    <Install />
    <Simple />
  </div>
</template>
