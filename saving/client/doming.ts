import { isUndefined } from '../shared/core';

export function seeIfElement(something: unknown): something is Element {
    if (isUndefined(something)) return false;
    if (typeof something !== 'object') return false;
    return something instanceof Element;
}
export function seeIfHTMLElement(something: unknown): something is HTMLElement {
    if (isUndefined(something)) return false;
    if (typeof something !== 'object') return false;
    return something instanceof HTMLElement;
}
