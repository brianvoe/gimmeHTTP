export interface BuilderOptions {
  indent?: string
  join?: string
}

export interface Line {
  depth: number
  line: string
}

export class Builder {
  private code: Line[] = []
  private indentChar: string
  private lineJoin: string
  private currentDepth: number = 0

  constructor(options: BuilderOptions = {}) {
    this.indentChar = options.indent || '  '
    this.lineJoin = options.join || '\n'
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
