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

declare interface BuilderOptions {
    indent?: string;
    join?: string;
    json?: JSON_2;
}

export declare function ClearRegistry(): void;

export declare interface Client {
    default?: boolean;
    language: string;
    client: string;
    generate: (config: any, http: any) => string;
}

export declare function Clients(): Client[];

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
        [key: string]: string | string[];
    };
    cookies?: {
        [key: string]: string;
    };
    body?: any;
}

export declare function IsJsonRequest(method: string, headers?: {
    [key: string]: string;
}): boolean;

declare interface JSON_2 {
    objOpen: string;
    objClose: string;
    arrOpen: string;
    arrClose: string;
    separator: string;
    endComma?: boolean;
}

export declare function Languages(): string[];

export declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

declare interface Outcome {
    error?: string;
    language?: string;
    client?: string;
    code?: string;
}

export declare function Register(client: Client | Client[]): Error | null;

export declare function Search(language: string, client?: string): Client | null;

export declare function SetDefault(language: string, client: string): void;

export declare interface Settings {
    language?: string;
    client?: string;
    config?: Config;
    http: Http;
}

export { }
