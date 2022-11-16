export type WordConfig =
    | UnknownConfig
    | NounConfig
    | VerbConfig
    | AdjectiveConfig;

export interface NounConfig {
    kind: 'noun';
    text: string;
}

export interface VerbConfig {
    kind: 'verb';
    text: string;
}

export interface AdjectiveConfig {
    kind: 'adjective';
    text: string;
}

export interface UnknownConfig {
    kind: 'unknown';
    text: string;
}
export function unknownConfigFrom(text: string): UnknownConfig {
    return { kind: 'unknown', text };
}

