<script lang="ts">
  import { defineComponent } from 'vue'
  import ShikiStyle from '../components/shiki_style.vue'

  export default defineComponent({
    components: {
      ShikiStyle
    },
    name: 'Settings'
  })
</script>

<style lang="scss">
  .settings {
    display: flex;
    flex-direction: column;
    gap: var(--spacing);
  }
</style>

<template>
  <div class="section settings">
    <a href="#settings"><h2 id="settings">Settings</h2></a>
    <div class="alert info"><strong>Info:</strong> The only required fields are language, http.method and http.url</div>
    <ShikiStyle language="javascript">
      <pre>
        const settings = {
          language: 'javascript', // Programming language - default is 'javascript'
          client: 'axios',        // HTTP client - default set by language

          // Optional
          config: {
            indent: '  ',       // Indentation characters
            join: '\n',         // Line join characters
            handleErrors: false // Handle errors
          },

          http: {
            // Required
            method: 'GET',
            url: 'https://api.gofakeit.com',

            // Optional
            headers: {
              'Content-Type': 'application/json'
            },
            cookies: {
              'session_id': 'abc123'
            },
            body: {
              first_name: 'Billy',
              email: 'billybob@gmail.com'
            }
          }
        }
      </pre>
    </ShikiStyle>
  </div>
</template>
