<script lang="ts">
  import { defineComponent } from 'vue'
  import Header from './header.vue'
  import Sidebar from './sidebar.vue'
  import AdSense from './components/adsense.vue'
  import Footer from './footer.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Header,
      Sidebar,
      AdSense,
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
    <Sidebar />

    <main class="content">
      <!-- router view -->
      <router-view />
      <!-- Smart AdSense with content gating -->
      <AdSense adSlot="1270131515" :minContentLength="150" :minSentences="2" />
      <Footer />
    </main>
  </div>
</template>
