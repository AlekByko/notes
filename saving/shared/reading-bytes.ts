import { broke, cast, isNull } from './core';

export type ByteUnit = 'tb' | 'gb' | 'mb' | 'kb' | 'b';
export function withBytesRead<R, E>(
    text: string,
    haveBytes: (value: number, unit: ByteUnit) => R,
    haveError: (reason: string, text: string) => E
): R | E {
    text = text.trim().toLowerCase();
    const regex = /(\d+(\.\d+)?)\s*(tb|gb|mb|kb|b)/i;
    const matched = regex.exec(text);
    if (isNull(matched)) return haveError('Bad input.', text);
    const [_full, textBytes, , unit] = matched;
    const bytes = parseFloat(textBytes);
    cast<ByteUnit>(unit);
    return haveBytes(bytes, unit);
}

export function makeBytes(value: number, unit: ByteUnit): number {
    let multiplier;
    switch(unit) {
        case 'b': multiplier = 1; break;
        case 'kb': multiplier = 1_000; break;
        case 'mb': multiplier = 1_000_000; break;
        case 'gb': multiplier = 1_000_000_000; break;
        case 'tb': multiplier = 1_000_000_000_000; break;
        default: return broke(unit);
    }
    let result = value * multiplier;
    result = Math.floor(result);
    return result;
}
