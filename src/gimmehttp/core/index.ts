import { Clients, Languages, Search, SetDefault, Register, ClearRegistry } from '../utils/registry'
import { Generate } from '../utils/generate'
import { Builder } from '../utils/builder'
import { IsJsonRequest } from '../utils/utils'

// Types
import type { Client } from '../utils/registry'
import type { Method, Settings, Config, Http } from '../utils/generate'

// Engine-only entry. Import clients from 'gimmehttp/clients' and register them:
//
//   import { Register, Generate } from 'gimmehttp/core'
//   import { goHttp, shellCurl } from 'gimmehttp/clients'
//   Register([goHttp, shellCurl])

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
