// Named client exports. Import only what you need and register it:
//
//   import { Register } from 'gimmehttp/core'
//   import { goHttp, jsFetch } from 'gimmehttp/clients'
//   Register([goHttp, jsFetch])
//
// Unused clients are tree-shaken out of your bundle.

import type { Client } from '../core'

export { default as cLibcurl } from './c.libcurl'
export { default as csharpHttp } from './csharp.http'
export { default as csharpRestsharp } from './csharp.restsharp'
export { default as dartHttp } from './dart.http'
export { default as goHttp } from './go'
export { default as javaHttpurlconnection } from './java.httpurlconnection'
export { default as javaOkhttp } from './java.okhttp'
export { default as jsFetch } from './js.fetch'
export { default as jsAxios } from './js.axios'
export { default as jsJquery } from './js.jquery'
export { default as kotlinKtor } from './kotlin.ktor'
export { default as nodeHttp } from './node.http'
export { default as nodeFetch } from './node.fetch'
export { default as phpCurl } from './php.curl'
export { default as phpGuzzle } from './php.guzzle'
export { default as pythonHttp } from './python.http'
export { default as pythonRequests } from './python.requests'
export { default as rubyNethttp } from './ruby.nethttp'
export { default as rubyFaraday } from './ruby.faraday'
export { default as rustReqwest } from './rust.reqwest'
export { default as shellCurl } from './shell.curl'
export { default as swiftNsurlsession } from './swift.nsurlsession'

import cLibcurlClient from './c.libcurl'
import csharpHttpClient from './csharp.http'
import csharpRestsharpClient from './csharp.restsharp'
import dartHttpClient from './dart.http'
import goHttpClient from './go'
import javaHttpurlconnectionClient from './java.httpurlconnection'
import javaOkhttpClient from './java.okhttp'
import jsFetchClient from './js.fetch'
import jsAxiosClient from './js.axios'
import jsJqueryClient from './js.jquery'
import kotlinKtorClient from './kotlin.ktor'
import nodeHttpClient from './node.http'
import nodeFetchClient from './node.fetch'
import phpCurlClient from './php.curl'
import phpGuzzleClient from './php.guzzle'
import pythonHttpClient from './python.http'
import pythonRequestsClient from './python.requests'
import rubyNethttpClient from './ruby.nethttp'
import rubyFaradayClient from './ruby.faraday'
import rustReqwestClient from './rust.reqwest'
import shellCurlClient from './shell.curl'
import swiftNsurlsessionClient from './swift.nsurlsession'

// Every built-in client. Register them all with `Register(allClients)`.
// Note: importing allClients pulls every client into your bundle.
export const allClients: Client[] = [
  cLibcurlClient,
  csharpHttpClient,
  csharpRestsharpClient,
  dartHttpClient,
  goHttpClient,
  javaHttpurlconnectionClient,
  javaOkhttpClient,
  jsFetchClient,
  jsAxiosClient,
  jsJqueryClient,
  kotlinKtorClient,
  nodeHttpClient,
  nodeFetchClient,
  phpCurlClient,
  phpGuzzleClient,
  pythonHttpClient,
  pythonRequestsClient,
  rubyNethttpClient,
  rubyFaradayClient,
  rustReqwestClient,
  shellCurlClient,
  swiftNsurlsessionClient
]
