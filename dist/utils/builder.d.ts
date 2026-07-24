export interface BuilderOptions {
    indent?: string;
    join?: string;
    json?: JSON;
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
    line(line?: string): void;
    append(line: string): void;
    json(json: any, isSub?: boolean): void;
    indent(): void;
    outdent(): void;
    output(): string;
}
