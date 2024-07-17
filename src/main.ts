/*
 * @Author: chenzhongsheng
 * @Date: 2024-06-23 09:23:28
 * @Description: Coding something
 */

import { JSXParser } from './parser/jsx-parser';

if (typeof window !== 'undefined') {
    // @ts-ignore
    if (!window.process) window.process = { env: {} };
    // @ts-ignore
    if (!window.Buffer) window.Buffer = {
        // @ts-ignore
        from: (array) => new Uint8Array(array),
        // @ts-ignore
        isBuffer: (v) => v instanceof Uint8Array,
    };
}

export function transformReact (input: string) {
    const parser = new JSXParser(input);
    return parser.toString();
}

export function isLimReact (input: string, filename = '') {
    return /\.lim\.[tj]sx$/.test(filename) || /\/\/ *use lim/.test(input) || /['"]use lim['"]/.test(input);
}