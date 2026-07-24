export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface Settings {
    language?: string;
    client?: string;
    config?: Config;
    http: Http;
}
export interface Outcome {
    error?: string;
    language?: string;
    client?: string;
    code?: string;
}
export interface Config {
    indent?: string;
    join?: string;
    handleErrors?: boolean;
}
export interface Http {
    method: Method;
    url: string;
    params?: {
        [key: string]: string | string[];
    };
    headers?: {
        [key: string]: string | string[];
    };
    cookies?: {
        [key: string]: string;
    };
    body?: any;
}
export declare function Generate(req: Settings): Outcome;
