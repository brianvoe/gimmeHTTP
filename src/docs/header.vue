<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    name: 'Header',
    data() {
      return {}
    }
  })
</script>

<style lang="scss">
  .header {
    /* css is in layout.scss */

    .center {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      width: 100%;
      max-width: 800px;
      box-sizing: border-box;

      .left {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center; // Ensure vertical alignment
        gap: var(--spacing);
        box-sizing: border-box;

        .logo {
          display: flex;
          justify-content: center;
          width: 100%;
          max-width: 150px;
          height: 100%;
          padding: var(--spacing-half) 0 var(--spacing-half) 0;
          box-sizing: border-box;
          overflow: hidden;

          img {
            width: 100%;
            height: calc(var(--header-height) - var(--spacing));
          }
        }

        .title {
          display: flex;
          align-items: center;
          padding: 5px 0 0 0; // extra padding due to line height offset
          margin: 0;
          font-size: 24px;
          font-weight: bold;
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
</template>
