import { isUndefined } from './shared/core';

export function addTag(tags: string[] | undefined, tag: string): string[] | undefined {
    if (isUndefined(tags)) {
        return [tag];
    } else {
        return [...tags, tag].toSet().toArray().sort();
    }
}
