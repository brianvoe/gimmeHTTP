import { Codes, CodesByLanguage, SetDefault, Register, ClearRegistry } from './utils/registry'
import { Generate } from './utils/generate'
import { Builder } from './utils/builder'
import { IsJsonRequest } from './utils/utils'

// Types
import type { Target } from './utils/registry'
import type { Method, Settings, Config, Http } from './utils/generate'

// Targets
import CLibCurl from './targets/c.libcurl'
import CSharpHttp from './targets/csharp.http'
import CSharpRest from './targets/csharp.restsharp'
import Go from './targets/go'
import JSFetch from './targets/js.fetch'
import JSAxios from './targets/js.axios'
import JSJquery from './targets/js.jquery'
import Node from './targets/node.http'
import NodeFetch from './targets/node.fetch'
import PHPCurl from './targets/php.curl'
import PHPGuzzle from './targets/php.guzzle'
import PythonHttp from './targets/python.http'
import PythonRequests from './targets/python.requests'
import Ruby from './targets/ruby.nethttp'
import RubyFaraday from './targets/ruby.faraday'
import RustReqwest from './targets/rust.reqwest'
import ShellCurl from './targets/shell.curl'
import SwiftNsurlsession from './targets/swift.nsurlsession'

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
