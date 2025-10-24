import{G as s}from"./gimmehttp-DZFXXoLO.js";import{d as a,S as r,_ as u,e as g,g as e,j as m,A as n,l,t as h,o as d}from"./shiki-BVECRVGe.js";const c=a({name:"VueUsagePage",components:{GimmeHttp:s,ShikiStyle:r},data(){return{demoHttp:{method:"GET",url:"https://api.example.com/users?limit=5",headers:{Accept:"application/json"}},lang:"",client:"",theme:"light"}},methods:{toggleTheme(){this.theme=this.theme==="light"?"dark":"light"}}}),f={class:"section vue-usage"};function v(p,t,G,H,y,k){const o=l("ShikiStyle"),i=l("GimmeHttp");return d(),g("div",f,[t[4]||(t[4]=e("header",null,[e("h2",null,"Use as a Vue Component"),e("p",null," You can consume GimmeHTTP as a Vue component and let it handle Shiki and rendering for you. Install the package, then either register it globally as a plugin or import the component locally. ")],-1)),t[5]||(t[5]=e("h3",null,"Global registration (plugin)",-1)),m(o,{language:"typescript"},{default:n(()=>[...t[1]||(t[1]=[e("pre",null,`        import { createApp } from 'vue'
        import App from './App.vue'
        import GimmeHttpVue from 'gimmehttp/vue'

        createApp(App)
          .use(GimmeHttpVue)
          .mount('#app')
      `,-1)])]),_:1}),t[6]||(t[6]=e("h3",null,"Local registration (single file component)",-1)),m(o,{language:"vue"},{default:n(()=>[...t[2]||(t[2]=[e("pre",null,`        <script setup lang="ts">
          import { GimmeHttp } from 'gimmehttp/vue'
          import type { Http } from 'gimmehttp'

          const request: Http = {
            method: 'GET',
            url: 'https://api.example.com/users?limit=10',
            headers: { Accept: 'application/json'}
          }

          const lang = 'go'
          const client = 'http'
        <\/script>

        <style>
          @import 'gimmehttp/vue.css';
        </style>

        <template>
          <GimmeHttp 
            // Required
            :http="request" 
            
            // Optional
            v-model:language="lang" 
            v-model:client="client" 
            theme="light" 
          />
        </template>
      `,-1)])]),_:1}),t[7]||(t[7]=e("h3",null,"Theme",-1)),m(o,{language:"vue"},{default:n(()=>[...t[3]||(t[3]=[e("pre",null,`        <script lang="ts">
          import { GimmeHttp } from 'gimmehttp/vue'
        <\/script>

        <template>
          <GimmeHttp 
            :http="{
              method: 'GET',
              url: 'https://example.com',
            }" 
            :theme="light" // 'light' | 'dark'
          />
        </template>
      `,-1)])]),_:1}),e("button",{onClick:t[0]||(t[0]=T=>p.toggleTheme())},"Toggle Theme ("+h(p.theme)+")",1),m(i,{http:p.demoHttp,theme:p.theme},null,8,["http","theme"])])}const V=u(c,[["render",v]]);export{V as default};
