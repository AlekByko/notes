import { toMapFromArray } from './maps';

export interface Pair { key: string; value: string; }

export function parseQueryStringIntoPairsByKey(search: string): Map<string, string> | null {
    const [, query] = search.split('?');
    if (query === undefined) return null;
    const chunks = query.split('&');
    const pairs = chunks.map(chunk => {
        const [rawKey, rawValue] = chunk.split('=');
        const key = decodeURIComponent(rawKey);
        const value = rawValue === undefined ? '' : decodeURIComponent(rawValue);
        const pair: Pair = { key, value };
        return pair;
    });
    const byKey = toMapFromArray(pairs, pair => pair.key, pair => pair.value, newer => newer);
    return byKey;
}
