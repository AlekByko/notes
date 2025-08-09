export type CliParam<K> =
    | { kind: 'boolean'; key: K & string; name: string; }
    | { kind: 'integer'; key: K & string; name: string; }
    | { kind: 'directory'; key: K & string; name: string; };

export type TypeOfCliParam<P> = P extends CliParam<any>
    ? P['kind'] extends 'boolean' ? boolean
    : P['kind'] extends 'integer' ? number
    : P['kind'] extends 'directory' ? string
    : never
    : P extends OtherCliParam<any, infer F>
    ? F
    : never;

export type OtherCliParam<K, S> = { kind: 'other'; key: K & string; name: string; read: (text: string) => S };

export function makeCliParams<T extends { [K in keyof T]: CliParam<K> | OtherCliParam<K, any>; }>(params: T): T {
    return params;
}

export type LikeCliParams<T> = { [K in keyof T]: CliParam<K> | OtherCliParam<K, any>; };

export type CliParams<T extends LikeCliParams<T>> = { [K in keyof T]: TypeOfCliParam<T[K]>; };

export const noLuckWithArgs = Symbol('no-luck-with-args');
