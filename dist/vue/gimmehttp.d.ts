import { PropType } from 'vue';
import { Config, Http } from '../utils/generate';
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    http: {
        type: PropType<Http>;
        required: true;
    };
    language: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    client: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    config: {
        type: PropType<Config>;
        required: false;
    };
    theme: {
        type: PropType<"light" | "dark">;
        required: false;
        default: string;
    };
}>, {}, {
    clientsList: import('../index').Client[];
    showCopied: boolean;
    openModal: boolean;
    openModalContent: boolean;
    codeStr: string;
    output: string;
    themeMode: "light" | "dark";
    internalLanguage: string;
    internalClient: string;
    checkInterval: number | null;
}, {
    languages(): string[];
    clients(): string[];
}, {
    logoSvg(name: string): string | null;
    setLanguage(lang: string | null): void;
    setClient(client: string | null): void;
    code(): void;
    clickCopy(): void;
    toggleModal(): void;
    clickModalBg(event: MouseEvent): void;
    clickModalLang(lang: string): void;
    clickModalClient(client: string): void;
    checkLocalStorage(): void;
}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, ("update:language" | "update:client")[], "update:language" | "update:client", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    http: {
        type: PropType<Http>;
        required: true;
    };
    language: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    client: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    config: {
        type: PropType<Config>;
        required: false;
    };
    theme: {
        type: PropType<"light" | "dark">;
        required: false;
        default: string;
    };
}>> & Readonly<{
    "onUpdate:language"?: ((...args: any[]) => any) | undefined;
    "onUpdate:client"?: ((...args: any[]) => any) | undefined;
}>, {
    language: string;
    client: string;
    theme: "light" | "dark";
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
