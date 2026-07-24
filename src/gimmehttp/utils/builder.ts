export interface BuilderOptions {
  indent?: string
  join?: string

  // JSON / object literal options
  json?: Partial<JSON>
}

export interface Line {
  depth: number
  line: string
}

export interface JSON {
  objOpen: string
  objClose: string
  arrOpen: string
  arrClose: string
  separator: string
  endComma?: boolean // Add comma at end of object or array
  quoteKeys: boolean // Whether object keys are wrapped in quotes

  // Target languages use different keywords for JSON-like scalar values
  // (for example, Python uses None/True/False).
  nullLiteral: string
  trueLiteral: string
  falseLiteral: string

  // Methods
  escapeString?: (value: string) => string
}

const defaultEscape = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')

export class Builder {
  private code: Line[] = []
  private indentChar: string
  private lineJoin: string
  private currentDepth: number = 0

  private jsonConfig: JSON = {
    objOpen: '{',
    objClose: '}',
    arrOpen: '[',
    arrClose: ']',
    separator: ': ',
    endComma: false,
    quoteKeys: true,

    // Default to JSON/JavaScript literals; clients can override these per language.
    nullLiteral: 'null',
    trueLiteral: 'true',
    falseLiteral: 'false',

    // Methods
    escapeString: defaultEscape
  }

  constructor(options: BuilderOptions = {}) {
    this.indentChar = options.indent || '  '
    this.lineJoin = options.join || '\n'
    if (options.json) {
      this.jsonConfig = { ...this.jsonConfig, ...options.json }
    }
  }

  public getIndent(): string {
    return this.indentChar
  }

  public getJoin(): string {
    return this.lineJoin
  }

  /** Format a string with `%s` (escaped), `%r` (raw), and `%%` (literal %). */
  public format(format: string, ...values: unknown[]): string {
    return this.formatValues(format, values)
  }

  /**
   * Append a new line. With no format args the string is used as-is.
   * With args, printf-style placeholders are substituted:
   * - `%s` escaped via json.escapeString (safe inside double-quoted literals)
   * - `%r` raw / unescaped (methods, identifiers, preformatted code)
   * - `%%` a literal `%`
   *
   * @example builder.line('req.Header.Set("%s", "%s")', key, value)
   * @example builder.line('client.%r("%s")', method, url)
   */
  public line(format: string = '', ...values: unknown[]): void {
    const line = values.length === 0 ? format : this.formatValues(format, values)
    // dont indent empty lines
    this.code.push({ depth: line === '' ? 0 : this.currentDepth, line })
  }

  /** Append to the current line (same %s / %r / %% formatting as line). */
  public append(format: string, ...values: unknown[]): void {
    const text = values.length === 0 ? format : this.formatValues(format, values)
    if (this.code.length > 0) {
      this.code[this.code.length - 1].line += text
    } else {
      this.line(text)
    }
  }

  private formatValues(format: string, values: unknown[]): string {
    const escape = this.jsonConfig.escapeString || defaultEscape
    let argIndex = 0
    const result = format.replace(/%([%sr])/g, (_match, kind: string) => {
      if (kind === '%') return '%'
      if (argIndex >= values.length) {
        throw new Error(`Builder: missing argument for %${kind} (needed arg ${argIndex + 1})`)
      }
      const value = values[argIndex++]
      const text = value == null ? '' : String(value)
      return kind === 's' ? escape(text) : text
    })
    if (argIndex < values.length) {
      throw new Error(`Builder: ${values.length - argIndex} unused format argument(s)`)
    }
    return result
  }

  public json(json: any, isSub: boolean = false): void {
    if (json === null || json === undefined) {
      this.writeScalar(this.jsonConfig.nullLiteral, isSub)
      return
    }

    switch (typeof json) {
      case 'object':
        if (Array.isArray(json)) {
          this.append(this.jsonConfig.arrOpen)
          this.indent()
          json.forEach((item, index) => {
            this.json(item, true)

            // Add comma if not last item
            if (index < json.length - 1 || this.jsonConfig.endComma) {
              this.append(',')
            }
          })
          this.outdent()
          this.line(this.jsonConfig.arrClose)
        } else {
          this.append(this.jsonConfig.objOpen)
          this.indent()
          const keys = Object.keys(json)
          keys.forEach((key, index) => {
            const escape = this.jsonConfig.escapeString || defaultEscape
            const keyText = this.jsonConfig.quoteKeys ? `"${escape(key)}"` : key
            this.line(keyText + this.jsonConfig.separator)
            const value = json[key]
            // Scalars stay on the key line; nested objects/arrays continue on that line then expand
            const complex = value !== null && typeof value === 'object'
            this.json(value, complex)

            // Add comma if not last key
            if (index < keys.length - 1 || this.jsonConfig.endComma) {
              this.append(',')
            }
          })
          this.outdent()
          this.line(this.jsonConfig.objClose)
        }
        break
      case 'string': {
        const escape = this.jsonConfig.escapeString || defaultEscape
        this.writeScalar(`"${escape(json)}"`, isSub)
        break
      }
      case 'boolean':
        this.writeScalar(json ? this.jsonConfig.trueLiteral : this.jsonConfig.falseLiteral, isSub)
        break
      default:
        this.writeScalar(String(json), isSub)
        break
    }
  }

  /** Emit a JSON payload as a single escaped string literal (safest across languages). */
  public jsonStringLiteral(value: any, quote: '"' | "'" = '"'): void {
    const encoded = JSON.stringify(value ?? null)
    const escape = quote === "'" ? (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") : defaultEscape
    this.append(`${quote}${escape(encoded)}${quote}`)
  }

  public indent(): void {
    this.currentDepth += 1
  }

  public outdent(): void {
    if (this.currentDepth > 0) {
      this.currentDepth -= 1
    }
  }

  public output(): string {
    return this.code
      .map(({ depth, line }) => `${this.indentChar.repeat(depth)}${line}`)
      .join(this.lineJoin)
      .trimEnd()
  }

  private writeScalar(value: string, isSub: boolean): void {
    if (isSub) {
      this.line(value)
    } else {
      this.append(value)
    }
  }
}
