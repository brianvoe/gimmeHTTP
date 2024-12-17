<script lang="ts">
  import { defineComponent } from 'vue'
  import VueShiki from '../components/vue_shiki.vue'

  import type { Http } from '../../gimmehttp'

  export default defineComponent({
    name: 'Simple',
    components: {
      VueShiki
    },
    data() {
      return {
        http: {
          url: 'https://jsonplaceholder.typicode.com/posts',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        } as Http
      }
    }
  })
</script>

<style lang="scss">
  .simple {
  }
</style>

<template>
  <div class="simple section">
    <h1>Simple</h1>
    <p>This is a simple example.</p>

    <VueShiki :http="http" />
  </div>
</template>
