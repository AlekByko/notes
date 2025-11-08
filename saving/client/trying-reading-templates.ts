import { readMarch, readOptions } from 'reading-templates';
import { broke } from '../shared/core';
import { dumpChockedAndContext } from '../shared/reading-basics';
import { March, Token } from './template-tokens';

// http://localhost:8081/sandbox.html?trying-reading-templates


var parsed = readOptions('{test| another test|and we done}', 0, 0);
console.log(parsed);
var parsed = readOptions('{test}', 0, 0);
console.log(parsed);
var parsed = readOptions('{}', 0, 0);
console.log(parsed);

tryMarch(`{abc|de fg|$hijk {lmn|$qrs|{tuv|wx|yz}}}`);


function tryMarch(text: string) {
    console.log(text);
    var march = readMarch(text, 0, 0, false, (_index, _tokens, choked) => choked);
    if (march.isBad) {
        dumpChockedAndContext(march, text);
    } else {
        const output = formatMarch(march.value);
        console.log(output);
    }
}

function formatMarch(march: March): string {
    const result: string[] = [];
    for (const token of march) {
        return formatToken(token);
    }
    return result.join(' ');
}

function formatToken(token: Token) {
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
            return `[OP: ${options.map(o => formatMarch(o)).join(' | ')}]`
        }
        default: return broke(token);
    }
}

