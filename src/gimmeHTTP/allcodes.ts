// use this file to export all language generators

import CLibCurl from './languages/c.libcurl'
import CSharpHttp from './languages/csharp.http'
import CSharpRest from './languages/csharp.restsharp'
import Curl from './languages/curl'
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
import SwiftNsurlsession from './languages/swift.nsurlsession'

export default [
  CLibCurl,

  CSharpHttp,
  CSharpRest,

  Curl,

  Go,

  JSFetch,
  JSAxios,
  JSJquery,

  Node,
  NodeFetch,

  PHPCurl,
  PHPGuzzle,

  PythonHttp,
  PythonRequests,

  Ruby,
  RubyFaraday,

  RustReqwest,

  SwiftNsurlsession
]
