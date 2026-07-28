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
export { default as csharpFlurl } from './csharp.flurl'
export { default as dartHttp } from './dart.http'
export { default as dartDio } from './dart.dio'
export { default as goHttp } from './go'
export { default as goResty } from './go.resty'
export { default as javaHttpurlconnection } from './java.httpurlconnection'
export { default as javaOkhttp } from './java.okhttp'
export { default as javaHttpclient } from './java.httpclient'
export { default as jsFetch } from './js.fetch'
export { default as jsAxios } from './js.axios'
export { default as jsJquery } from './js.jquery'
export { default as jsKy } from './js.ky'
export { default as kotlinKtor } from './kotlin.ktor'
export { default as kotlinOkhttp } from './kotlin.okhttp'
export { default as nodeHttp } from './node.http'
export { default as nodeFetch } from './node.fetch'
export { default as nodeAxios } from './node.axios'
export { default as nodeGot } from './node.got'
export { default as phpCurl } from './php.curl'
export { default as phpGuzzle } from './php.guzzle'
export { default as phpSymfony } from './php.symfony'
export { default as pythonHttp } from './python.http'
export { default as pythonRequests } from './python.requests'
export { default as pythonHttpx } from './python.httpx'
export { default as pythonAiohttp } from './python.aiohttp'
export { default as rubyNethttp } from './ruby.nethttp'
export { default as rubyFaraday } from './ruby.faraday'
export { default as rubyHttparty } from './ruby.httparty'
export { default as rustReqwest } from './rust.reqwest'
export { default as rustUreq } from './rust.ureq'
export { default as shellCurl } from './shell.curl'
export { default as shellHttpie } from './shell.httpie'
export { default as shellWget } from './shell.wget'
export { default as swiftNsurlsession } from './swift.nsurlsession'
export { default as swiftAlamofire } from './swift.alamofire'

import cLibcurlClient from './c.libcurl'
import csharpHttpClient from './csharp.http'
import csharpRestsharpClient from './csharp.restsharp'
import csharpFlurlClient from './csharp.flurl'
import dartHttpClient from './dart.http'
import dartDioClient from './dart.dio'
import goHttpClient from './go'
import goRestyClient from './go.resty'
import javaHttpurlconnectionClient from './java.httpurlconnection'
import javaOkhttpClient from './java.okhttp'
import javaHttpclientClient from './java.httpclient'
import jsFetchClient from './js.fetch'
import jsAxiosClient from './js.axios'
import jsJqueryClient from './js.jquery'
import jsKyClient from './js.ky'
import kotlinKtorClient from './kotlin.ktor'
import kotlinOkhttpClient from './kotlin.okhttp'
import nodeHttpClient from './node.http'
import nodeFetchClient from './node.fetch'
import nodeAxiosClient from './node.axios'
import nodeGotClient from './node.got'
import phpCurlClient from './php.curl'
import phpGuzzleClient from './php.guzzle'
import phpSymfonyClient from './php.symfony'
import pythonHttpClient from './python.http'
import pythonRequestsClient from './python.requests'
import pythonHttpxClient from './python.httpx'
import pythonAiohttpClient from './python.aiohttp'
import rubyNethttpClient from './ruby.nethttp'
import rubyFaradayClient from './ruby.faraday'
import rubyHttpartyClient from './ruby.httparty'
import rustReqwestClient from './rust.reqwest'
import rustUreqClient from './rust.ureq'
import shellCurlClient from './shell.curl'
import shellHttpieClient from './shell.httpie'
import shellWgetClient from './shell.wget'
import swiftNsurlsessionClient from './swift.nsurlsession'
import swiftAlamofireClient from './swift.alamofire'

// Every built-in client. Register them all with `Register(allClients)`.
// Note: importing allClients pulls every client into your bundle.
export const allClients: Client[] = [
  cLibcurlClient,
  csharpHttpClient,
  csharpRestsharpClient,
  csharpFlurlClient,
  dartHttpClient,
  dartDioClient,
  goHttpClient,
  goRestyClient,
  javaHttpurlconnectionClient,
  javaOkhttpClient,
  javaHttpclientClient,
  jsFetchClient,
  jsAxiosClient,
  jsJqueryClient,
  jsKyClient,
  kotlinKtorClient,
  kotlinOkhttpClient,
  nodeHttpClient,
  nodeFetchClient,
  nodeAxiosClient,
  nodeGotClient,
  phpCurlClient,
  phpGuzzleClient,
  phpSymfonyClient,
  pythonHttpClient,
  pythonRequestsClient,
  pythonHttpxClient,
  pythonAiohttpClient,
  rubyNethttpClient,
  rubyFaradayClient,
  rubyHttpartyClient,
  rustReqwestClient,
  rustUreqClient,
  shellCurlClient,
  shellHttpieClient,
  shellWgetClient,
  swiftNsurlsessionClient,
  swiftAlamofireClient
]
