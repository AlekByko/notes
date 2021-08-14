export function insteadEach<T extends { [K in keyof T]: unknown; }, V>(
    obj: T, instead: (key: keyof T, obj: T) => V,
): { [K in keyof T]: V; } {
    const result: any = {};
    for (const key in obj) {
        result[key] = instead(key, obj);
    }
    return result;
}
