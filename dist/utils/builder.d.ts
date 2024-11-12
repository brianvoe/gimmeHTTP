export interface BuilderOptions {
    indent?: string;
    join?: string;
}
export interface Line {
    depth: number;
    line: string;
}
export declare class Builder {
    private code;
    private indentChar;
    private lineJoin;
    private currentDepth;
    constructor(options?: BuilderOptions);
    line(line?: string): void;
    indent(): void;
    outdent(): void;
    output(): string;
}
