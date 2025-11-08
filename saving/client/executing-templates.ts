import { stripAllComments } from './stripping-comments';

export function executeTemplate(text: string, _seed: number) {
    text = stripAllComments(text);
    return text;
}


export function makeSeed() {
    const a = Math.random() * 0x200000; // upper 21 bits
    const b = Math.random() * 0x100000000; // lower 32 bits
    return ((a | 0) * 0x100000000) + (b >>> 0);
}



