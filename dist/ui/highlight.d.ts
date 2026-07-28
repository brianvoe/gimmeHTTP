import { default as hljs } from 'highlight.js/lib/core';
export declare const languageMap: Record<string, string>;
export declare function highlightCode(code: string, language: string): string;
export declare function highlightLanguage(language: string): string;
export default hljs;
