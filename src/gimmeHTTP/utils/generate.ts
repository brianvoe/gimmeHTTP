import { Request } from '../types'
import { CodesByLanguage } from './registry'

export function Generate(req: Request): string {
  let err = validate(req)
  if (err) {
    return err.message
  }

  req.config = setConfig(req.config)

  const codes = CodesByLanguage(req.language.toLowerCase())
  if (codes.length === 0) {
    return `Language not found`
  }

  // Find the target, if not provided use the default
  const target = req.target
    ? req.target.toLowerCase()
    : codes.find((c) => c.language.toLowerCase() === req.language.toLowerCase() && c.default)?.target.toLowerCase() ||
      ''
  if (!target) {
    return `Target not found`
  }

  // Find the code generator
  const code = codes.find((c) => {
    return c.language.toLowerCase() === req.language.toLowerCase() && c.target.toLowerCase() === target
  })
  if (!code) {
    return `Code not found for language and target`
  }

  return code.generate(req.config, req.http)
}

function validate(req: Request): Error | undefined {
  if (!req) {
    return new Error('Request is required')
  }

  if (!req.language) {
    return new Error('language is required')
  }

  const codes = CodesByLanguage(req.language)
  if (codes.length === 0) {
    return new Error(`Language '${req.language}' not found`)
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