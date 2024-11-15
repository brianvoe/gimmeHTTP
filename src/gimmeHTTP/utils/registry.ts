export interface Target {
  default?: boolean
  language: string
  target: string
  generate: (config: any, http: any) => string
}

const codes: Target[] = []

export function Codes(): Target[] {
  return codes
}

export function CodesByLanguage(language: string): Target[] {
  return codes.filter((c) => c.language === language)
}

export function SetDefault(language: string, target: string): void | Error {
  const code = codes.find((c) => c.language === language && c.target === target)
  if (!code) {
    return new Error(`Target '${target}' not found`)
  }

  codes.forEach((c) => {
    if (c.language === language) {
      c.default = c === code
    }
  })
}

export function Register(gen: Target | Target[]): void | Error {
  if (!gen) {
    return new Error('Target is required')
  }

  // Register multiple targets
  if (Array.isArray(gen)) {
    gen.forEach((g) => Register(g))
    return
  }

  // Set default to false if undefined
  if (gen.default === undefined) {
    gen.default = false
  }

  // Check if the target already exists
  const existing = codes.find((c) => c.language === gen.language && c.target === gen.target)
  if (existing) {
    // Replace
    codes.splice(codes.indexOf(existing), 1)
  }

  // If the target is the only one for this language, set it as default
  const langGens = codes.filter((c) => c.language === gen.language)
  if (langGens.length === 0) {
    gen.default = true
  }

  // If the target is marked as default, remove default from other targets of the same language
  if (gen.default) {
    codes.forEach((c) => {
      if (c.language === gen.language) {
        c.default = false
      }
    })
  }

  // Add the new target
  codes.push(gen)
}

export function ClearRegistry(): void {
  codes.splice(0, codes.length)
}
