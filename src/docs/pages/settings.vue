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
          // Required
          language: 'javascript', // Programming Language
          client: 'axios',        // Client - default set by language

          // Optional
          config: {
            indent: '  ',       // Indentation characters
            join: '\n',         // Line join characters
            handleErrors: false // Handle errors
          },

          http: {
            // Required
            method: 'GET', // GET, POST, PUT, DELETE, PATCH, etc.
            url: 'https://example.com',

            // Optional
            headers: {
              // string: string
              'Content-Type': 'application/json'
            },
            cookies: {
              // string: string
              'session_id': 'abc123'
            },
            body: {
              // any
              first_name: 'Billy',
              email: 'billybob@gmail.com',
              address: {
                street: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zip: '12345'
              }
            }
          }
        }
      </pre>
    </ShikiStyle>
  </div>
</template>
