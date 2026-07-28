import { PropType } from 'vue';
import { GimmeHTTP, Settings } from '../ui/gimmehttp';
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import('vue').DefineComponent<import('vue').ExtractPropTypes<{
    settings: {
        type: PropType<Settings>;
        required: true;
    };
}>, {}, {
    instance: GimmeHTTP | null;
}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, ("update:language" | "update:client")[], "update:language" | "update:client", import('vue').PublicProps, Readonly<import('vue').ExtractPropTypes<{
    settings: {
        type: PropType<Settings>;
        required: true;
    };
}>> & Readonly<{
    "onUpdate:language"?: ((...args: any[]) => any) | undefined;
    "onUpdate:client"?: ((...args: any[]) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, true, {}, any>;
