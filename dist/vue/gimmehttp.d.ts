import { PropType } from 'vue';
import { GimmeHTTP } from '../ui/gimmehttp';
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
    copy: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    picker: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>, {}, {
    instance: GimmeHTTP | null;
}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, ("update:language" | "update:client")[], "update:language" | "update:client", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
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
    copy: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
    picker: {
        type: BooleanConstructor;
        required: false;
        default: boolean;
    };
}>> & Readonly<{
    "onUpdate:language"?: ((...args: any[]) => any) | undefined;
    "onUpdate:client"?: ((...args: any[]) => any) | undefined;
}>, {
    theme: "dark" | "light";
    copy: boolean;
    picker: boolean;
    language: string;
    client: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
