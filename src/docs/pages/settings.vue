<script lang="ts">
  import { defineComponent } from 'vue'
  import HighlightStyle from '@/docs/components/highlight_style.vue'

  export default defineComponent({
    components: {
      HighlightStyle
    },
    name: 'Settings'
  })
</script>

<style lang="scss">
  .settings {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1.5);
    width: 100%;
  }
</style>

<template>
  <div class="settings">
    <div class="section">
      <h2>Settings</h2>
      <p>
        One settings shape drives both the engine and the UI. <code>Generate</code> takes core
        <code>Settings</code> from <code>gimmehttp/core</code>. The widget uses the same fields under
        <code>settings</code>, plus optional <code>theme</code>, <code>copy</code>, and <code>picker</code>.
      </p>

      <div class="alert info">
        <strong>Info:</strong> The only required fields are <code>http.method</code> and <code>http.url</code>. Language
        defaults to <code>javascript</code> when omitted.
      </div>
    </div>

    <div class="section">
      <h3>UI Settings (<code>GimmeHTTP</code>)</h3>
      <p>
        Import <code>Settings</code> from <code>gimmehttp</code> for the widget. It includes the core fields plus
        <code>theme</code>, <code>copy</code>, and <code>picker</code>. Pass it as <code>settings</code> on the
        constructor (or as the Vue <code>settings</code> prop).
      </p>
      <HighlightStyle language="typescript">
        <pre>
          import { GimmeHTTP } from 'gimmehttp'
          import type { Settings } from 'gimmehttp'

          const settings: Settings = {
            // Selection
            language: 'go',           // Programming language (default: javascript)
            client: 'http',           // Client — defaults per language

            // Appearance
            theme: 'dark',            // 'dark' | 'light' (default: dark)

            // Controls
            copy: true,               // Show copy button (default: true)
            picker: true,             // Show language + client controls (default: true)

            // Code generation
            config: {
              indent: '  ',           // Indentation characters (default: '  ')
              join: '\n',             // Line join characters (default: '\n')
              handleErrors: false     // Error handling in generated code (default: false)
            },

            // Request
            http: {
              method: 'POST',         // GET | POST | PUT | PATCH | DELETE
              url: 'https://example.com/api/users',
              params: {               // Query string params
                limit: '10'
              },
              headers: {
                'Content-Type': 'application/json'
              },
              cookies: {
                session_id: 'abc123'
              },
              body: {                 // string | object | any
                first_name: 'Billy',
                email: 'billy@example.com'
              }
            }
          }

          new GimmeHTTP({
            container: '#code',
            settings
          })
        </pre>
      </HighlightStyle>
    </div>

    <div class="section">
      <h3>Core Settings (<code>Generate</code>)</h3>
      <HighlightStyle language="typescript">
        <pre>
          import { Generate } from 'gimmehttp/core'

          const settings = {
            // Selection
            language: 'javascript',   // Programming language (default: javascript)
            client: 'axios',          // Client — defaults per language

            // Code generation
            config: {
              indent: '  ',           // Indentation characters (default: '  ')
              join: '\n',             // Line join characters (default: '\n')
              handleErrors: false     // Error handling in generated code (default: false)
            },

            // Request
            http: {
              method: 'GET',          // GET | POST | PUT | PATCH | DELETE
              url: 'https://example.com',
              params: {               // Query string params
                limit: '10'
              },
              headers: {
                'Content-Type': 'application/json'
              },
              cookies: {
                session_id: 'abc123'
              },
              body: {                 // string | object | any
                first_name: 'Billy',
                email: 'billybob@gmail.com'
              }
            }
          }

          const { code, error } = Generate(settings)
        </pre>
      </HighlightStyle>
    </div>
  </div>
</template>
