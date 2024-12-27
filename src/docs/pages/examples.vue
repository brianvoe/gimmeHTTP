<script lang="ts">
  import { defineComponent } from 'vue'
  import ShikiStyle from '../components/shiki_style.vue'
  import { Generate, Settings } from '../../gimmehttp/utils/generate'

  export default defineComponent({
    components: {
      ShikiStyle
    },
    name: 'Examples',
    data() {
      return {
        simpleGetCode: '',
        simplePostCode: ''
      }
    },
    mounted() {
      // Simple GET request
      const getOutcome = Generate({
        language: 'javascript',
        client: 'axios',
        http: {
          method: 'GET',
          url: 'https://example.com'
        }
      })
      this.simpleGetCode = getOutcome.code

      // Simple POST request
      const postOutcome = Generate({
        language: 'go',
        http: {
          method: 'POST',
          url: 'https://example.com',
          body: {
            key: 'value'
          }
        }
      })
      this.simplePostCode = postOutcome.code
    }
  })
</script>

<style lang="scss">
  .examples {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);

    .example {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-half);
    }
  }
</style>

<template>
  <div class="section examples">
    <a href="#examples"><h2 id="examples">Usage Examples</h2></a>
    <div class="example">
      <h3>Simple GET Request</h3>
      <ShikiStyle language="javascript">
        <pre>
        // Settings
        const settings = {
          language: 'javascript',
          client: 'axios',
          http: {
            method: 'GET',
            url: 'https://example.com'
          }
        }

        // Generate code - returns code, language, client, and error
        const { code, language, client, error } = Generate(settings)
        if (!error) {
          console.log(code)
        }

        // Output
        console.log(code)
      </pre
        >
      </ShikiStyle>
      <h4>Output</h4>
      <ShikiStyle language="javascript">
        <pre>{{ simpleGetCode }}</pre>
      </ShikiStyle>
    </div>

    <div class="example">
      <h3>Simple POST Request</h3>
      <ShikiStyle language="javascript">
        <pre>
        // Settings
        const settings = {
          language: 'go',
          http: {
            method: 'POST',
            url: 'https://example.com',
            body: {
              key: 'value'
            }
          }
        }

        // Generate code - returns code, language, client, and error
        const { code, language, client, error } = Generate(settings)
        if (!error) {
          console.log(code)
        }

        // Output
        console.log(code)
      </pre
        >
      </ShikiStyle>
      <h4>Output</h4>
      <ShikiStyle language="javascript">
        <pre>{{ simplePostCode }}</pre>
      </ShikiStyle>
    </div>
  </div>
</template>
