<script lang="ts">
  import { defineComponent } from 'vue'
  import Header from './header.vue'
  import Footer from './footer.vue'

  import Intro from './pages/intro.vue'
  import Install from './pages/install.vue'
  import Settings from './pages/settings.vue'
  import Examples from './pages/examples.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Header,
      Intro,
      Install,
      Settings,
      Examples,
      Footer
    },
    data() {
      return {}
    }
  })
</script>

<style lang="scss">
  .fake-header {
    min-height: calc(var(--header-height) + var(--spacing));
  }

  .content {
    /* scss in layout.scss */
  }
</style>

<template>
  <Header />

  <div class="content">
    <Intro />
    <Install />
    <Settings />
    <Examples />
    <Footer />
  </div>
</template>
