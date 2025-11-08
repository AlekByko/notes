import { readMarch } from 'reading-templates';
import { broke } from '../shared/core';
import { dumpChockedAndContext } from '../shared/reading-basics';
import { March, Token } from './template-tokens';

export function tryMarch(text: string) {
    console.log(text);
    var march = readMarch(text, 0, 0, false, (_index, _tokens, choked) => choked);
    if (march.isBad) {
        dumpChockedAndContext(march, text);
    } else {
        const input = march.value;
        console.log(input);
        const output = formatMarch(input);
        console.log(output);
    }
}

export function testMarch(text: string, expected: string) {
    var march = readMarch(text, 0, 0, false, (_index, _tokens, choked) => choked);
    if (march.isBad) {
        console.log(text);
        dumpChockedAndContext(march, text);
    } else {
        const input = march.value;
        console.log(input);
        const output = formatMarch(input);
        if (output === expected) {
            console.log('PASSED:', text);
        } else {
            console.log('DIFFRENT!');
            console.log(text);
            console.log(expected);
            console.log(output);
        }
    }
}

export function formatMarch(march: March): string {
    const result: string[] = [];
    for (const token of march) {
        const formatted = formatToken(token);
        result.push(formatted);
    }
    return result.join(' ');
}

export function formatToken(token: Token) {
    switch (token.kind) {
        case 'assignment': {
            const { name, operator, value } = token;
            return `[AS: ${name} ${operator} ${formatMarch(value)}]`;
        }
        case 'literal': {
            const { literal } = token;
            return `"${literal}"`;
        }
        case 'identifier': {
            const { identifier } = token;
            return `[ID: ${identifier}]`;
        }
        case 'options': {
            const { options } = token;
            return `[OP: ${options.map(option => formatMarch(option)).join(' | ')}]`
        }
        default: return broke(token);
    }
}
