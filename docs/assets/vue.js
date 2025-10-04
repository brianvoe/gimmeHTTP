import{G as s}from"./gimmehttp.js";import{S as a}from"./shiki_style.js";import{d as r,_ as u,c as g,a as e,b as p,w as n,f as i,o as d}from"./index.js";import"./index2.js";const c=r({name:"VueUsagePage",components:{GimmeHttp:s,ShikiStyle:a},data(){return{demoHttp:{method:"GET",url:"https://api.example.com/users?limit=5",headers:{Accept:"application/json"}},lang:"",client:""}}}),h={class:"section vue-usage"};function f(m,t,H,G,v,y){const o=i("ShikiStyle"),l=i("GimmeHttp");return d(),g("div",h,[t[3]||(t[3]=e("header",null,[e("h2",null,"Use as a Vue Component"),e("p",null," You can consume GimmeHTTP as a Vue component and let it handle Shiki and rendering for you. Install the package, then either register it globally as a plugin or import the component locally. ")],-1)),t[4]||(t[4]=e("h3",null,"Global registration (plugin)",-1)),p(o,{language:"typescript"},{default:n(()=>[...t[0]||(t[0]=[e("pre",null,`import { createApp } from 'vue'
import App from './App.vue'
import GimmeHttpVue from 'gimmehttp/vue'

createApp(App)
  .use(GimmeHttpVue)
  .mount('#app')
      `,-1)])]),_:1}),t[5]||(t[5]=e("h3",null,"Local registration (single file component)",-1)),p(o,{language:"vue"},{default:n(()=>[...t[1]||(t[1]=[e("pre",null,`<script setup lang="ts">
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
      `,-1)])]),_:1}),t[6]||(t[6]=e("h3",null,"Theme",-1)),p(o,{language:"vue"},{default:n(()=>[...t[2]||(t[2]=[e("pre",null,`<script setup lang="ts">
  import { GimmeHttp } from 'gimmehttp/vue'
  import type { Http } from 'gimmehttp'

  const request: Http = {
    method: 'GET',
    url: 'https://api.example.com/users?limit=10',
    headers: { Accept: 'application/json'}
  }
<\/script>

<template>
  <GimmeHttp 
    :http="request" 
    theme="light" 
  />
</template>
      `,-1)])]),_:1}),p(l,{http:m.demoHttp,theme:"light"},null,8,["http"])])}const x=u(c,[["render",f]]);export{x as default};
