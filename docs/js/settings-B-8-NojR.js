import{d as s,S as a,_ as o,e as i,g as e,j as r,m as l,A as d,l as c,o as p}from"./shiki-BVECRVGe.js";const g=s({components:{ShikiStyle:a},name:"Settings"}),m={class:"section settings"};function u(f,n,h,y,S,_){const t=c("ShikiStyle");return p(),i("div",m,[n[1]||(n[1]=e("h2",null,"Settings",-1)),n[2]||(n[2]=e("div",{class:"alert info"},[e("strong",null,"Info:"),l(" The only required fields are language, http.method and http.url")],-1)),r(t,{language:"javascript"},{default:d(()=>[...n[0]||(n[0]=[e("pre",null,`        const settings = {
          // Required
          language: 'javascript', // Programming Language
          client: 'axios',        // Client - default set by language

          // Optional
          config: {
            indent: '  ',       // Indentation characters
            join: '\\n',         // Line join characters
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
      `,-1)])]),_:1})])}const x=o(g,[["render",u]]);export{x as default};
