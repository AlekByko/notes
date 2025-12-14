import { isUndefined } from '../shared/core';

export function seeIfElement(e: unknown): e is Element {
    if (isUndefined(e)) return false;
    if (typeof e !== 'object') return false;
    if (e !== null && 'nodeType' in e && e.nodeType === Node.ELEMENT_NODE) return true;
    return false;
}
