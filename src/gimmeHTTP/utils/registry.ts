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

// Search for target, whether or not they pass in a client
// If no client, return the default target of that language
export function SearchTarget(language: string, client?: string): Target | Error {
  if (language === '' || language === undefined) {
    return new Error('Language is required')
  }

  // Loop through and get all targets for the language
  const targets = codes.filter((c) => c.language.toLowerCase() === language.toLowerCase())
  if (targets.length === 0) {
    return new Error('No targets found of language: ' + language)
  }

  // Get default client
  const defaultTarget: Target = targets.find((c) => c.default) || targets[0]

  // If no client, return default
  if (!client) {
    return defaultTarget
  }

  // If client, return the client
  const target = targets.find((c) => c.client.toLowerCase() === client.toLowerCase())
  if (!target) {
    return defaultTarget
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

  // Get current list of targets from target.language
  const curTargets = codes.filter((c) => c.language.toLowerCase() === target.language.toLowerCase())
  const exists = curTargets.find((c) => c.client.toLowerCase() === target.client.toLowerCase())

  // Set default to false if undefined
  if (target.default === undefined) {
    target.default = curTargets.length === 0 ? true : false
  }

  // If it exist, overwrite the target
  if (exists) {
    const index = codes.indexOf(target)
    codes[index] = target
    return
  }

  // otherwise, add the target
  codes.push(target)
}

export function ClearRegistry(): void {
  codes.splice(0, codes.length)
}
