<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'Footer',
    data() {
      return {
        year: new Date().getFullYear()
      }
    }
  })
</script>

<style lang="scss">
  .footer {
    padding: var(--spacing-half) !important;
    font-size: smaller;
    text-align: center;
    color: var(--color-text-muted);
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }
</style>

<template>
  <footer class="section footer">
    © {{ year }} <a href="http://webiswhatido.com" target="_blank">Brian Voelker</a>.
    <br />
    GimmeHTTP is under the MIT license.
    <br />
    <a href="/privacy" target="_blank">Privacy Policy</a>
  </footer>
</template>
