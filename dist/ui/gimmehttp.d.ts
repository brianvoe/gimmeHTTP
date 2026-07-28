import { Client, Config, Http } from '../core';
/** Widget settings: selection → appearance → controls → config → http. */
export interface Settings {
    language?: string;
    client?: string;
    theme?: 'dark' | 'light';
    copy?: boolean;
    picker?: boolean;
    config?: Config;
    http: Http;
}
export interface Events {
    afterChange?: (language: string, client: string, code: string) => void;
}
export interface Options {
    container: string | HTMLElement;
    clients?: Client[];
    settings: Settings;
    events?: Events;
}
export declare class GimmeHTTP {
    private container;
    private root;
    private http;
    private config?;
    private controls;
    private events;
    private scopedClients;
    private language;
    private client;
    private code;
    private modalOpen;
    private clientMenuOpen;
    private copiedTimeout;
    private onDocClick;
    constructor(options: Options);
    setSettings(partial: Partial<Settings>): void;
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
    private clientsPool;
    private languages;
    private findClient;
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
    /** Grow the widget when the language picker is taller than the current snippet. */
    private fitModalHeight;
    private closeModal;
}
