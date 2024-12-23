import { fail } from '../shared/core';

export function failLoud(message: string): never {
    debugger;
    console.trace();
    alert(message);
    debugger;
    throw new Error(message);
}

export function logAndFail(e: any): never {
    debugger;
    console.error(e);
    console.trace();
    debugger;
    throw new Error(e);
}

export function alertAndFail(message: string): never {
    debugger;
    console.trace();
    alert(message);
    window.history.go(0);
    return fail(message);
}

