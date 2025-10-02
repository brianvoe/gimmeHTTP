<script lang="ts">
  import { defineComponent } from 'vue'
  import Header from './header.vue'
  import Footer from './footer.vue'

  import Intro from './pages/intro.vue'
  import Install from './pages/install.vue'
  import Settings from './pages/settings.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Header,
      Intro,
      Install,
      Settings,
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
</style>

<template>
  <Header />

  <div class="content">
    <Intro />
    <Install />
    <Settings />
    <Footer />
  </div>
</template>
