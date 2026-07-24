export interface Client {
    default?: boolean;
    language: string;
    client: string;
    generate: (config: any, http: any) => string;
}
export declare function Clients(): Client[];
export declare function Languages(): string[];
export declare function Search(language: string, client?: string): Client | null;
export declare function SetDefault(language: string, client: string): void;
export declare function Register(client: Client | Client[]): Error | null;
export declare function ClearRegistry(): void;
