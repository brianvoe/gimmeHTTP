export interface BuilderOptions {
  indent?: string
  join?: string

  // JSON options
  json?: JSON
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
}

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
    endComma: false
  }

  constructor(options: BuilderOptions = {}) {
    this.indentChar = options.indent || '  '
    this.lineJoin = options.join || '\n'
    this.jsonConfig = options.json || this.jsonConfig
  }

  public getIndent(): string {
    return this.indentChar
  }

  public getJoin(): string {
    return this.lineJoin
  }

  public line(line: string = ''): void {
    // dont indent empty lines
    this.code.push({ depth: line === '' ? 0 : this.currentDepth, line })
  }

  public append(line: string): void {
    if (this.code.length > 0) {
      this.code[this.code.length - 1].line += line
    } else {
      this.line(line)
    }
  }

  public json(json: any, isSub: boolean = false): void {
    if (!json) {
      this.append('null')
      return
    }

    switch (typeof json) {
      case 'object':
        if (Array.isArray(json)) {
          this.append(this.jsonConfig.arrOpen)
          this.indent()
          json.forEach((item, index) => {
            this.json(item, typeof json === 'object' || Array.isArray(json))

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
            // Set key
            this.line(`"${key}"` + this.jsonConfig.separator)
            this.json(json[key], typeof key === 'object' || Array.isArray(key))

            // Add comma if not last key
            if (index < keys.length - 1 || this.jsonConfig.endComma) {
              this.append(',')
            }
          })
          this.outdent()
          this.line(this.jsonConfig.objClose)
        }
        break
      case 'string':
        // Wrap string in double quotes
        if (isSub) {
          this.line(`"${json}"`)
        } else {
          this.append(`"${json}"`)
        }
        break
      default:
        if (isSub) {
          this.line(String(json))
        } else {
          this.append(String(json))
        }
        break
    }
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
}
