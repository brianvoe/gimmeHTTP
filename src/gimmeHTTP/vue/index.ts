import type { App } from 'vue'
import GimmeHttp from './gimmehttp.vue'

export { GimmeHttp }

export default {
  install(app: App) {
    app.component('GimmeHttp', GimmeHttp)
  }
}
