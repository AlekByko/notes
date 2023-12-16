import { isDefined } from './core';

export interface Counted<T> {
    count: number;
    value: T;
}
export type Counters<T> = Map<string, Counted<T>>;

export function makeCounters<AnyItem, RightItem extends AnyItem, Value>(
    items: AnyItem[],
    isRight: (item: AnyItem) => item is RightItem,
    valueOf: (item: RightItem) => Value,
    keyOf: (item: Value) => string,
): Counters<Value> {
    const result = new Map<string, Counted<Value>>();
    for (const item of items) {
        if (!isRight(item)) continue;
        const value = valueOf(item);
        const key = keyOf(value);
        const found = result.get(key);
        if (isDefined(found)) {
            found.count += 1;
        } else {
            const counted: Counted<Value> = { count: 1, value };
            result.set(key, counted);
        }
    }
    return result;
}
