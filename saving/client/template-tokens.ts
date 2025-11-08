export type March = Token[];

export type Token = LiteralToken | OptionsToken | IdentifierToken | AssignmentToken;

export interface LiteralToken {
    kind: 'literal';
    literal: string;
}

export interface OptionsToken {
    kind: 'options';
    options: March[];
}

export interface IdentifierToken {
    kind: 'identifier';
    identifier: string;
}

export interface AssignmentToken {
    kind: 'assignment';
    identifier: string;
    operator: string;
    value: March;
}
