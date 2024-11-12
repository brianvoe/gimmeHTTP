export interface Target {
    default?: boolean;
    language: string;
    target: string;
    generate: (config: any, http: any) => string;
}
export declare function Codes(): Target[];
export declare function CodesByLanguage(language: string): Target[];
export declare function SetDefault(language: string, target: string): void | Error;
export declare function Register(gen: Target | Target[]): void;
export declare function ClearRegistry(): void;
