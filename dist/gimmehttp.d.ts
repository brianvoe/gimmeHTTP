export declare class Builder {
    private code;
    private indentChar;
    private lineJoin;
    private currentDepth;
    constructor(options?: BuilderOptions);
    line(line?: string): void;
    append(line: string): void;
    indent(): void;
    outdent(): void;
    output(): string;
}

declare interface BuilderOptions {
    indent?: string;
    join?: string;
}

export declare function ClearRegistry(): void;

export declare function Codes(): Target[];

export declare interface Config {
    indent?: string;
    join?: string;
    handleErrors?: boolean;
}

export declare function Generate(req: Settings): Outcome;

export declare interface Http {
    method: Method;
    url: string;
    headers?: {
        [key: string]: string;
    };
    cookies?: {
        [key: string]: string;
    };
    body?: any;
}

export declare function IsJsonRequest(method: string, headers?: {
    [key: string]: string;
}): boolean;

export declare function Languages(): string[];

export declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

declare interface Outcome {
    error?: string;
    language?: string;
    client?: string;
    code?: string;
}

export declare function Register(target: Target | Target[]): void | Error;

export declare function SearchTarget(language: string, client?: string): Target | Error;

export declare function SetDefault(language: string, client: string): void | Error;

export declare interface Settings {
    language: string;
    client: string;
    config?: Config;
    http: Http;
}

export declare interface Target {
    default?: boolean;
    language: string;
    client: string;
    generate: (config: any, http: any) => string;
}

export { }
