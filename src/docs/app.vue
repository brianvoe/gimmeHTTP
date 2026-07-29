<script lang="ts">
  import { defineComponent } from 'vue'
  import Header from './header.vue'
  import Footer from './footer.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Header,
      Footer
    },
    computed: {
      contentClass(): Record<string, boolean> {
        const meta = this.$route.meta
        return {
          'with-sidebar': Boolean(meta.sidebar),
          wide: Boolean(meta.wide)
        }
      }
    }
  })
</script>

<style lang="scss"></style>

<template>
  <Header />

  <div class="layout">
    <main class="content" :class="contentClass">
      <!-- router view -->
      <router-view />
      <!-- Smart AdSense with content gating -->
      <!-- <AdSense adSlot="1270131515" :minContentLength="150" :minSentences="2" /> -->
      <Footer />
    </main>
  </div>
</template>
