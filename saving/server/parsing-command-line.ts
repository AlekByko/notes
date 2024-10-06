import { alwaysNull, broke, same } from './shared/core';
import { capturedFrom, chokedFrom, readRegOver, wholeThing } from './shared/reading-basics';
import { readLoopOver } from './shared/reading-loop';
import { OptionsReader } from './shared/reading-options';
import { SequenceReader } from './shared/reading-sequence';

const readNonWhitespace = readRegOver(/[^\s]+/y, wholeThing);
const readCliArgValue = new OptionsReader()
    .option(readQuotedString)
    .option(readNonWhitespace).build();

const readCliArg = new SequenceReader(alwaysNull)
    .lit('--')
    .skip(readRegOver(/\s*/y, same))
    .read(readRegOver(/\w+/y, wholeThing), (_before, name) => ({ name }))
    .skip(readRegOver(/\s+/y, same))
    .read(readCliArgValue, ({ name, ...before }, value) => ({ ...before, [name]: value }))
    .build(x => x);

function readQuotedString(text: string, start: number) {
    let state: 'start' | 'value' = 'start';
    let index = start;
    let quote = '"';
    while (index < text.length) {
        const at = text[index];
        switch (state) {
            case 'start': {
                if (at === '"' || at === "'") {
                    quote = at;
                    state = 'value';
                    index += 1;
                    continue;
                } else {
                    return chokedFrom(index);
                }
            }
            case 'value': {
                if (at === quote) {
                    index += 1;
                    const value = text.substring(start + 1, index - 1);
                    return capturedFrom(index, value);
                } else {
                    index += 1;
                    continue;
                }
            }
            default: return broke(state);
        }
    }
    return chokedFrom(index);
}

export const readCliArgs = readLoopOver<{}, { [name: string]: string | undefined }>(
    readCliArg,
    readRegOver(/\s+/y, alwaysNull),
    x => ({ ...x }),
    (args, arg) => ({ ...args, ...arg }),
    1, 40,
);

