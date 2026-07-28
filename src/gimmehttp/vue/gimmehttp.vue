<script lang="ts">
  import type { PropType } from 'vue'
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '../ui/gimmehttp'
  import type { Settings } from '../ui/gimmehttp'

  export default defineComponent({
    name: 'GimmeHttp',
    emits: ['update:language', 'update:client'],
    props: {
      settings: {
        type: Object as PropType<Settings>,
        required: true
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
        settings: this.settings,
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
      settings: {
        handler(newVal: Settings) {
          this.instance?.setSettings(newVal)
        },
        deep: true
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
