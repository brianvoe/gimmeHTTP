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
    data() {
      return {}
    }
  })
</script>

<style lang="scss"></style>

<template>
  <Header />

  <div class="layout">
    <main class="content">
      <!-- router view -->
      <router-view />
      <!-- Smart AdSense with content gating -->
      <!-- <AdSense adSlot="1270131515" :minContentLength="150" :minSentences="2" /> -->
      <Footer />
    </main>
  </div>
</template>
