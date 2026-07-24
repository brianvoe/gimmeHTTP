interface Url {
    hostname: string;
    path: string;
    port: number;
    protocol: string;
    params: string;
}
export declare function ParseUrl(url: string): Url;
export declare function IsJsonRequest(method: string, headers?: {
    [key: string]: string;
}): boolean;
export declare function GetContentType(headers?: {
    [key: string]: string | string[];
}): string;
export declare function HasBody(body: any): boolean;
export declare function IsStringBody(body: any): boolean;
export declare function IsObjectBody(body: any): boolean;
export declare function ContentTypeIncludes(contentType: string, type: 'json' | 'xml' | 'form' | 'text' | 'blob'): boolean;
export declare function InferContentType(body: any): string;
export declare function GetEffectiveContentType(headers?: {
    [key: string]: string | string[];
}, body?: any): {
    contentType: string;
    wasInferred: boolean;
};
export {};
