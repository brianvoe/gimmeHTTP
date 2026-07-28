<script lang="ts">
  import { defineComponent } from 'vue'
  import { GimmeHTTP } from '@/gimmehttp'
  import type { Http } from '@/gimmehttp/core'

  type Preset = {
    id: string
    label: string
    http: Http
  }

  const presets: Preset[] = [
    {
      id: 'basic',
      label: 'Basic',
      http: {
        method: 'GET',
        url: 'https://api.example.com/v1/users'
      }
    },
    {
      id: 'params',
      label: 'Params',
      http: {
        method: 'GET',
        url: 'https://api.example.com/v1/users',
        params: {
          limit: '10',
          'address.country': 'US',
          tags: ['admin', 'beta']
        }
      }
    },
    {
      id: 'headers',
      label: 'Headers',
      http: {
        method: 'GET',
        url: 'https://api.example.com/v1/users',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer token',
          'X-Request-Id': 'req-42'
        }
      }
    },
    {
      id: 'cookies',
      label: 'Cookies',
      http: {
        method: 'GET',
        url: 'https://api.example.com/v1/profile',
        cookies: {
          session_id: 'abc123',
          theme: 'dark'
        }
      }
    },
    {
      id: 'json',
      label: 'JSON body',
      http: {
        method: 'POST',
        url: 'https://api.example.com/v1/users',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          name: 'Ada Lovelace',
          email: 'ada@example.com',
          meta: {
            role: 'admin',
            tags: ['beta', 'staff']
          }
        }
      }
    },
    {
      id: 'form',
      label: 'Form body',
      http: {
        method: 'POST',
        url: 'https://api.example.com/v1/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          username: 'ada',
          password: 'secret'
        }
      }
    },
    {
      id: 'full',
      label: 'Full',
      http: {
        method: 'POST',
        url: 'https://api.example.com/v1/users',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token'
        },
        params: {
          dry_run: 'true'
        },
        cookies: {
          session_id: 'abc123'
        },
        body: {
          name: 'Ada Lovelace',
          email: 'ada@example.com'
        }
      }
    }
  ]

  export default defineComponent({
    name: 'GifCapture',
    data() {
      return {
        presets,
        presetId: 'json',
        instance: null as GimmeHTTP | null
      }
    },
    mounted() {
      const preset = this.presets.find((p) => p.id === this.presetId) ?? this.presets[0]
      this.instance = new GimmeHTTP({
        container: this.$refs.widget as HTMLElement,
        settings: {
          language: 'shell',
          client: 'curl',
          theme: 'dark',
          http: preset.http
        }
      })
    },
    unmounted() {
      this.instance?.destroy()
      this.instance = null
    },
    methods: {
      setPreset(id: string) {
        const preset = this.presets.find((p) => p.id === id)
        if (!preset || !this.instance) {
          return
        }
        this.presetId = id
        this.instance.setHttp(preset.http)
      }
    }
  })
</script>

<style lang="scss">
  .gif-capture {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
    gap: 16px;

    .gif_controls {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;

      button {
        min-width: 88px;
        padding: 8px 14px;
        border: 1px solid var(--border-color, #333);
        border-radius: 6px;
        background: transparent;
        color: var(--text-color, #e8e6e3);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;

        &.active {
          border-color: var(--accent, #ff9122);
          color: var(--accent, #ff9122);
          background: color-mix(in srgb, var(--accent, #ff9122) 12%, transparent);
        }

        &:hover {
          border-color: var(--accent, #ff9122);
        }
      }
    }

    .gif_stage {
      width: min(720px, 100%);
    }
  }
</style>

<template>
  <div class="gif-capture">
    <div class="gif_controls" role="group" aria-label="Request preset">
      <button
        v-for="p in presets"
        :key="p.id"
        type="button"
        :class="{ active: presetId === p.id }"
        @click="setPreset(p.id)"
      >
        {{ p.label }}
      </button>
    </div>
    <div ref="widget" class="gif_stage"></div>
  </div>
</template>
