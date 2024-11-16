export interface Target {
  default?: boolean
  language: string
  client: string
  generate: (config: any, http: any) => string
}

const codes: Target[] = []

export function Codes(): Target[] {
  return codes
}

export function SearchTarget(language: string, client?: string): Target | Error {
  if (language === '' || language === undefined) {
    return new Error('Language is required')
  }

  // Loop through and get all targets for the language
  const languages = codes.filter((c) => c.language.toLowerCase() === language.toLowerCase())

  // If no client, loop through languages and return the default
  if (!client) {
    // Stop if you find one
    const defaultLanguage = languages.find((c) => c.default)
    if (defaultLanguage) {
      return defaultLanguage
    }

    // If no default, return the first one
    return languages[0]
  }

  // If client, return the client
  const target = languages.find((c) => c.client.toLowerCase() === client.toLowerCase())
  if (!target) {
    return new Error(`Client '${client}' not found for language '${language}'`)
  }

  return target
}

export function SetDefault(language: string, client: string): void | Error {
  const targetResult = SearchTarget(language, client)
  if (targetResult instanceof Error) {
    return targetResult
  }

  // Set the target as default
  targetResult.default = true
}

export function Register(target: Target | Target[]): void | Error {
  if (!target) {
    return new Error('Target is required')
  }

  // Register multiple targets
  if (Array.isArray(target)) {
    target.forEach((g) => Register(g))
    return
  }

  // Set default to false if undefined
  if (target.default === undefined) {
    target.default = false
  }

  // Check if the target already exists
  const targetResult = SearchTarget(target.language, target.client)
  if (targetResult instanceof Error) {
    codes.push(target)

    // If its the only target, set it as default
    if (codes.filter((c) => c.language === target.language).length === 1) {
      target.default = true
    }

    return
  }

  // If it exists, replace the whole target
  const index = codes.indexOf(targetResult)
  codes[index] = target

  // If its the only target, set it as default
  if (codes.filter((c) => c.language === target.language).length === 1) {
    target.default = true
  }
}

export function ClearRegistry(): void {
  codes.splice(0, codes.length)
}
