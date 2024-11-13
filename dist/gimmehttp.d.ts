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

declare interface BuilderOptions {
    indent?: string;
    join?: string;
}

export declare function ClearRegistry(): void;

export declare function Codes(): Target[];

export declare function CodesByLanguage(language: string): Target[];

export declare interface Config {
    indent?: string;
    join?: string;
    handleErrors?: boolean;
}

export declare function Generate(req: Request_2): string;

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

export declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export declare function Register(gen: Target | Target[]): void;

declare interface Request_2 {
    language: string;
    target: string;
    config?: Config;
    http: Http;
}
export { Request_2 as Request }

export declare function SetDefault(language: string, target: string): void | Error;

export declare interface Target {
    default?: boolean;
    language: string;
    target: string;
    generate: (config: any, http: any) => string;
}

export { }
