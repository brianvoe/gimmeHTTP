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
export declare function EscapeDoubleQuoted(value: string): string;
/** GET -> Get, patch -> Patch. Used by languages whose method enums are PascalCase. */
export declare function PascalCaseMethod(method: string): string;
export declare function FormatCookieHeader(cookies: {
    [key: string]: string;
}): string;
/** Merge query params into a URL, preserving any existing query string. */
export declare function BuildUrlWithParams(url: string, params?: {
    [key: string]: string | string[];
}): string;
export {};
