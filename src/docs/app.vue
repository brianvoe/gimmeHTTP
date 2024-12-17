<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'App',
    data() {}
  })
</script>

<style lang="scss">
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    min-width: 100%;
    height: var(--header-height);
    padding: 0;
    margin: 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
    background-color: var(--color-secondary);
    overflow: hidden;

    .center {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      width: 100%;
      max-width: 800px;

      .left {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: var(--spacing);

        .logo {
          width: 100%;
          max-width: 150px;
          height: 100%;
          max-height: var(--header-height);
          overflow: hidden;

          img {
            max-width: 100%;
            max-height: 100%;
          }
        }

        .title {
          font-size: 2rem;
          padding: 0;
          margin: 0;
        }
      }

      .socials {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: var(--spacing-half);

        a {
          img {
            max-width: 30px;
            max-height: 30px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="header">
    <div class="center">
      <div class="left">
        <div class="logo">
          <img src="./assets/images/logo.svg" alt="GimmeHTTP" />
        </div>
        <h1 class="title">GimmeHTTP</h1>
      </div>
      <div class="socials">
        <a href="https://github.com/brianvoe/gimmehttp" target="_blank">
          <img src="./assets/images/github.png" />
        </a>
        <a href="https://www.npmjs.com/package/gimmehttp" target="_blank">
          <img src="./assets/images/npm.png" />
        </a>
      </div>
    </div>
  </div>

  <router-view />
</template>
