<script lang="ts">
  import type { PropType } from 'vue'
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '../ui/gimmehttp'
  import type { Config, Http } from '../utils/generate'

  export default defineComponent({
    name: 'GimmeHttp',
    emits: ['update:language', 'update:client'],
    props: {
      http: {
        type: Object as PropType<Http>,
        required: true
      },
      language: {
        type: String,
        required: false,
        default: ''
      },
      client: {
        type: String,
        required: false,
        default: ''
      },
      config: {
        type: Object as PropType<Config>,
        required: false
      },
      theme: {
        type: String as PropType<'light' | 'dark'>,
        required: false,
        default: 'dark'
      },
      copy: {
        type: Boolean,
        required: false,
        default: true
      },
      picker: {
        type: Boolean,
        required: false,
        default: true
      }
    },
    data() {
      return {
        instance: null as GimmeHTTP | null
      }
    },
    mounted() {
      this.instance = new GimmeHTTP({
        container: this.$el as HTMLElement,
        http: this.http,
        language: this.language || undefined,
        client: this.client || undefined,
        config: this.config,
        settings: {
          theme: this.theme,
          copy: this.copy,
          picker: this.picker
        },
        events: {
          afterChange: (language, client) => {
            this.$emit('update:language', language)
            this.$emit('update:client', client)
          }
        }
      })
    },
    unmounted() {
      this.instance?.destroy()
      this.instance = null
    },
    watch: {
      http: {
        handler(newVal: Http) {
          this.instance?.setHttp(newVal)
        },
        deep: true
      },
      config: {
        handler(newVal: Config) {
          this.instance?.setConfig(newVal)
        },
        deep: true
      },
      language(newVal: string) {
        if (newVal) {
          this.instance?.setLanguage(newVal, this.client || undefined)
        }
      },
      client(newVal: string) {
        if (newVal) {
          this.instance?.setClient(newVal)
        }
      },
      theme(newVal: 'light' | 'dark') {
        this.instance?.setTheme(newVal)
      }
    }
  })
</script>

<style lang="scss">
  @use '../ui/gimmehttp';
</style>

<template>
  <div class="gimmehttp-wrap"></div>
</template>
