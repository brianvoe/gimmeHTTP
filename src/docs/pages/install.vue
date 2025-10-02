<script lang="ts">
  import { defineComponent } from 'vue'
  import ShikiStyle from '@/docs/components/shiki_style.vue'

  export default defineComponent({
    components: {
      ShikiStyle
    },
    name: 'Install'
  })
</script>

<style lang="scss">
  .install {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }
</style>

<template>
  <div class="section install">
    <a href="#install"><h2 id="install">Installation</h2></a>
    <ShikiStyle language="shell">
      <pre>
        npm i gimmehttp
      </pre>
    </ShikiStyle>
  </div>
</template>
