export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface Request {
  language: string
  target: string

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

// Register of language generators
export interface Generator {
  default?: boolean
  language: string
  target: string
  generate: (config: any, http: any) => string
}
