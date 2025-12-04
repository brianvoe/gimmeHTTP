<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'

  export default defineComponent({
    components: {
      HighlightStyle
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
    <h2>Installation</h2>
    <p>
      Install gimmehttp with npm, pnpm, or yarn. The library bundles both the code generation library and the Vue
      component, so you can plug it into your build steps or your docs with a single dependency.
    </p>

    <HighlightStyle language="shell">
      <pre>
        npm install gimmehttp
      </pre>
    </HighlightStyle>
  </div>
</template>
