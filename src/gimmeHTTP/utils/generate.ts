import { SearchTarget } from './registry'

export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface Settings {
  language: string
  client: string

  config?: Config

  http: Http
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

export function Generate(req: Settings): string {
  let err = validate(req)
  if (err) {
    return err.message
  }

  req.config = setConfig(req.config)

  const target = SearchTarget(req.language, req.client)
  if (target instanceof Error) {
    return target.message
  }

  return target.generate(req.config, req.http)
}

function validate(req: Settings): Error | undefined {
  if (!req) {
    return new Error('Request is required')
  }

  // Language
  if (!req.language) {
    return new Error('language is required')
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

function setConfig(config: any): any {
  config = config || {}

  if (!config.indent) {
    config.indent = '  '
  }

  if (!config.join) {
    config.join = '\n'
  }

  if (config.handleErrors === undefined) {
    config.handleErrors = false
  }

  return config
}
