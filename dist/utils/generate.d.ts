export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export interface Request {
    language: string;
    target: string;
    config?: Config;
    http: Http;
}
export interface Config {
    indent?: string;
    join?: string;
    handleErrors?: boolean;
}
export interface Http {
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
export declare function Generate(req: Request): string;
