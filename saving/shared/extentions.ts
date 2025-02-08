export const dotFlv = '.flv';
export const dotMkv = '.mkv';
export const dotTs = '.ts';
export const dotWmv = '.wmv';
export const dotMp4 = '.mp4';
export const dotJpg = '.jpg';
export const dotLog = '.log';
export const dotJson = '.json';

export const knownVideoExtensions = new Set([dotFlv, dotWmv, dotMp4]);

export function seeIfVideoExtention(extention: string): boolean {
    return knownVideoExtensions.has(extention);
}
