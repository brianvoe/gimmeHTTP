import { Clients, Languages, Search, SetDefault, Register, ClearRegistry } from './utils/registry'
import { Generate } from './utils/generate'
import { Builder } from './utils/builder'
import { IsJsonRequest } from './utils/utils'

// Types
import type { Client } from './utils/registry'
import type { Method, Settings, Config, Http } from './utils/generate'

// Clients
import CLibCurl from './clients/c.libcurl'
import CSharpHttp from './clients/csharp.http'
import CSharpRest from './clients/csharp.restsharp'
import DartHttp from './clients/dart.http'
import Go from './clients/go'
import JavaHttpURLConnection from './clients/java.httpurlconnection'
import JavaOkHttp from './clients/java.okhttp'
import JSFetch from './clients/js.fetch'
import JSAxios from './clients/js.axios'
import JSJquery from './clients/js.jquery'
import KotlinKtor from './clients/kotlin.ktor'
import Node from './clients/node.http'
import NodeFetch from './clients/node.fetch'
import PHPCurl from './clients/php.curl'
import PHPGuzzle from './clients/php.guzzle'
import PythonHttp from './clients/python.http'
import PythonRequests from './clients/python.requests'
import Ruby from './clients/ruby.nethttp'
import RubyFaraday from './clients/ruby.faraday'
import RustReqwest from './clients/rust.reqwest'
import ShellCurl from './clients/shell.curl'
import SwiftNsurlsession from './clients/swift.nsurlsession'

// Register all languages
Register(CLibCurl)
Register(CSharpHttp)
Register(CSharpRest)
Register(DartHttp)
Register(Go)
Register(JavaHttpURLConnection)
Register(JavaOkHttp)
Register(JSFetch)
Register(JSAxios)
Register(JSJquery)
Register(KotlinKtor)
Register(Node)
Register(NodeFetch)
Register(PHPCurl)
Register(PHPGuzzle)
Register(PythonHttp)
Register(PythonRequests)
Register(Ruby)
Register(RubyFaraday)
Register(RustReqwest)
Register(ShellCurl)
Register(SwiftNsurlsession)

export {
  // Registry
  Client,
  Clients,
  Languages,
  Search,
  SetDefault,
  Register,
  ClearRegistry,

  // Generate
  Method,
  Settings,
  Config,
  Http,
  Generate,

  // Builder
  Builder,

  // Utils
  IsJsonRequest
}
