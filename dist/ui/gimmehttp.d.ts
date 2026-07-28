import { Client, Config, Http } from '../core';
export interface UISettings {
    theme?: 'dark' | 'light';
    copy?: boolean;
    picker?: boolean;
}
export interface GimmeHTTPEvents {
    afterChange?: (language: string, client: string, code: string) => void;
}
export interface GimmeHTTPOptions {
    container: string | HTMLElement;
    http: Http;
    clients?: Client[];
    language?: string;
    client?: string;
    config?: Config;
    settings?: UISettings;
    events?: GimmeHTTPEvents;
}
export declare class GimmeHTTP {
    private container;
    private root;
    private http;
    private config?;
    private settings;
    private events;
    private language;
    private client;
    private code;
    private modalOpen;
    private clientMenuOpen;
    private copiedTimeout;
    private onDocClick;
    constructor(options: GimmeHTTPOptions);
    setHttp(http: Http): void;
    setConfig(config: Config): void;
    setLanguage(language: string, client?: string): void;
    setClient(client: string): void;
    setTheme(theme: 'dark' | 'light'): void;
    getLanguage(): string;
    getClient(): string;
    getCode(): string;
    destroy(): void;
    private persist;
    private syncOthers;
    private clientsForLanguage;
    private generate;
    private highlightedOutput;
    private renderOutputHtml;
    private render;
    private langControl;
    private clientControl;
    private copyControl;
    private themeControl;
    private wireEvents;
    private bindDocClick;
    private unbindDocClick;
    private copy;
    private toggleClientMenu;
    private openClientMenu;
    private closeClientMenu;
    private toggleModal;
    private openModal;
    private closeModal;
}
