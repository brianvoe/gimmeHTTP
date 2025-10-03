import{G as l}from"./gimmehttp.js";import{S as a}from"./shiki_style.js";import{d as m,_ as s,c as r,a as e,b as n,w as p,f as u,o as c}from"./index.js";import"./index2.js";const d=m({name:"VueUsagePage",components:{GimmeHttp:l,ShikiStyle:a},data(){return{demoHttp:{method:"GET",url:"https://api.example.com/users?limit=5",headers:{Accept:"application/json"}},lang:"",client:""}}}),g={class:"section vue-usage"};function f(i,t,h,v,G,H){const o=u("ShikiStyle");return c(),r("div",g,[t[2]||(t[2]=e("header",null,[e("h2",null,"Use as a Vue Component"),e("p",null," You can consume GimmeHTTP as a Vue component and let it handle Shiki and rendering for you. Install the package, then either register it globally as a plugin or import the component locally. ")],-1)),t[3]||(t[3]=e("h3",null,"Global registration (plugin)",-1)),n(o,{language:"typescript"},{default:p(()=>[...t[0]||(t[0]=[e("pre",null,`import { createApp } from 'vue'
import App from './App.vue'
import GimmeHttpVue from 'gimmehttp/vue'

createApp(App)
  .use(GimmeHttpVue)
  .mount('#app')
      `,-1)])]),_:1}),t[4]||(t[4]=e("h3",null,"Local registration (single file component)",-1)),n(o,{language:"vue"},{default:p(()=>[...t[1]||(t[1]=[e("pre",null,`<script setup lang="ts">
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
      `,-1)])]),_:1})])}const V=s(d,[["render",f]]);export{V as default};
