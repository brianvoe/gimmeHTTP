export interface BuilderOptions {
    indent?: string;
    join?: string;
    json?: Partial<JSON>;
}
export interface Line {
    depth: number;
    line: string;
}
export interface JSON {
    objOpen: string;
    objClose: string;
    arrOpen: string;
    arrClose: string;
    separator: string;
    endComma?: boolean;
    quoteKeys: boolean;
    nullLiteral: string;
    trueLiteral: string;
    falseLiteral: string;
    escapeString?: (value: string) => string;
}
export declare class Builder {
    private code;
    private indentChar;
    private lineJoin;
    private currentDepth;
    private jsonConfig;
    constructor(options?: BuilderOptions);
    getIndent(): string;
    getJoin(): string;
    /** Format a string with `%s` (escaped), `%r` (raw), and `%%` (literal %). */
    format(format: string, ...values: unknown[]): string;
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
    line(format?: string, ...values: unknown[]): void;
    /** Append to the current line (same %s / %r / %% formatting as line). */
    append(format: string, ...values: unknown[]): void;
    private formatValues;
    json(json: any, isSub?: boolean): void;
    /** Emit a JSON payload as a single escaped string literal (safest across languages). */
    jsonStringLiteral(value: any, quote?: '"' | "'"): void;
    indent(): void;
    outdent(): void;
    output(): string;
    private writeScalar;
}
