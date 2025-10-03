<script lang="ts">
  import { defineComponent } from 'vue'
  import Header from './header.vue'
  import Sidebar from './sidebar.vue'
  import Footer from './footer.vue'

  export default defineComponent({
    name: 'App',
    components: {
      Header,
      Sidebar,
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
      <Footer />
    </main>
  </div>
</template>
