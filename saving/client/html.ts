export interface Declaration {
    kind: 'declaration';
    public?: string;
    system?: string;
}
export interface ClosingTag {
    readonly kind: 'closing-tag';
    readonly name: string;
}
export function closingTagFrom(name: string): ClosingTag {
    return { kind: 'closing-tag', name };
}
export interface OpeningTag {
    readonly kind: 'opening-tag';
    readonly name: string;
    readonly attributes: Attribute[] | null;
}
export function openingTagFrom(name: string, attributes: Attribute[] | null): OpeningTag {
    return { kind: 'opening-tag', name, attributes };
}
export interface AtomicTag {
    readonly kind: 'atomic-tag';
    readonly name: string;
    readonly attributes: Attribute[] | null;
}
export function atomicTagFrom(name: string, attributes: Attribute[] | null): AtomicTag {
    return { kind: 'atomic-tag', name, attributes };
}
export interface Whitespace {
    readonly kind: 'whitespace';
}
export const whitespace: Whitespace = { kind: 'whitespace' };

export type Tag = OpeningTag | ClosingTag | AtomicTag;
export type Html = Tag | Whitespace | Text;

export interface Attribute {
    name: string;
    value: string;
}

export interface Text {
    kind: 'text';
    text: string;
}

export function textFrom(text: string): Text {
    return { kind: 'text', text };
}
