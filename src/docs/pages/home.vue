<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: 'Home',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  })
</script>

<style lang="css">
  .home {
  }
</style>

<template>
  <div class="home">
    <h1>{{ msg }}</h1>
  </div>
</template>
