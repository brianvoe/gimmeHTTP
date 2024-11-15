import { Codes, CodesByLanguage, SetDefault, Register, ClearRegistry } from './utils/registry'
import { Generate } from './utils/generate'
import { Builder } from './utils/builder'
import { IsJsonRequest } from './utils/utils'

// Types
import type { Target } from './utils/registry'
import type { Method, Settings, Config, Http } from './utils/generate'

// Targets
import CLibCurl from './languages/c.libcurl'
import CSharpHttp from './languages/csharp.http'
import CSharpRest from './languages/csharp.restsharp'
import Go from './languages/go'
import JSFetch from './languages/js.fetch'
import JSAxios from './languages/js.axios'
import JSJquery from './languages/js.jquery'
import Node from './languages/node.http'
import NodeFetch from './languages/node.fetch'
import PHPCurl from './languages/php.curl'
import PHPGuzzle from './languages/php.guzzle'
import PythonHttp from './languages/python.http'
import PythonRequests from './languages/python.requests'
import Ruby from './languages/ruby.nethttp'
import RubyFaraday from './languages/ruby.faraday'
import RustReqwest from './languages/rust.reqwest'
import ShellCurl from './languages/shell.curl'
import SwiftNsurlsession from './languages/swift.nsurlsession'

// Register all languages
Register(CLibCurl)
Register(CSharpHttp)
Register(CSharpRest)
Register(Go)
Register(JSFetch)
Register(JSAxios)
Register(JSJquery)
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
  Target,
  Codes,
  CodesByLanguage,
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
