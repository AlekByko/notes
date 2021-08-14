export interface Jammed {
    readonly kind: 'jammed';
    readonly isJammed: true;
    readonly isEoffed: false;
    readonly index: number;
    readonly reason?: string;
}

export type Read<T> = (index: number, text: string) => Tried<T>;

export function jammedFrom(index: number, reason?: string): Jammed {
    return { kind: 'jammed', isJammed: true, isEoffed: false, index, reason };
}

export interface Passed<T> {
    readonly kind: 'passed';
    readonly isJammed: false;
    readonly start: number;
    readonly index: number;
    readonly value: T;
}

export function passedFrom<T>(
    start: number, index: number, value: T,
): Passed<T> {
    return { kind: 'passed', isJammed: false, start, index, value };
}

export interface Eoffed {
    readonly kind: 'eoffed';
    readonly isJammed: true;
    readonly isEoffed: true;
    readonly index: number;
}

export function eoffedFrom(index: number): Eoffed {
    return { kind: 'eoffed', isJammed: true, isEoffed: true, index };
}

export type Tried<T> = Passed<T> | Jammed | Eoffed;
