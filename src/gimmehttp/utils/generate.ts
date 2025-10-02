import { Search } from './registry'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface Settings {
  language?: string
  client?: string

  config?: Config
  http: Http
}

// The outcome of the generated code
// or an error message
export interface Outcome {
  error?: string

  language?: string // if set by default
  client?: string // if set by default
  code?: string
}

export interface Config {
  // The character(s) to use for indentation
  indent?: string // default: '  '

  // The character(s) to use for joining lines
  join?: string // default: '\n'

  // Whether or not to handle errors in the generated code
  // default: false to help keep the generated code simple by default
  handleErrors?: boolean // default: false
}

export interface Http {
  method: Method
  url: string
  headers?: { [key: string]: string }
  cookies?: { [key: string]: string }
  body?: any
}

export function Generate(req: Settings): Outcome {
  let err = validate(req)
  if (err) {
    return { error: err.message }
  }

  // Set default values for config
  req.config = setConfig(req.config)

  // Set default language if not set
  if (!req.language) {
    req.language = 'javascript' // I know, I know, but I have to pick a default
  }

  // Search for client, grab default if not found
  const client = Search(req.language, req.client)
  if (!client) {
    return { error: 'Client not found' }
  }

  // Generate the code
  const code = client.generate(req.config, req.http)

  return {
    language: client.language,
    client: client.client,
    code: code
  } as Outcome
}

function validate(req: Settings): Error | undefined {
  if (!req) {
    return new Error('Request is required')
  }

  if (!req.http) {
    return new Error('http is required')
  }

  if (!req.http.method) {
    return new Error('http.method is required')
  }

  if (!req.http.url) {
    return new Error('http.url is required')
  }

  return undefined
}

function setConfig(config: Config | undefined): Config {
  config = config || {}

  if (config.handleErrors === undefined) {
    config.handleErrors = false
  }

  return config
}
