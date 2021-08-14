export function typeOf(value: unknown): string {
    return Object.prototype.toString.call(value);
}
const typeOfArray = typeOf([]);

export function isArray(value: unknown): value is unknown[] {
    return typeOf(value) === typeOfArray;
}
