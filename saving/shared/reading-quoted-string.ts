import { capturedFrom, chokedFrom, ParsedOrNot } from './reading-basics';

export function readQuotedString(text: string, index: number): ParsedOrNot<string> {
    const { length } = text;
    const quote = text[index];
    index += 1;
    const startIndex = index;
    while (index < length) {
        const at = text[index];
        switch (at) {
            case quote: {
                const chunk = text.substring(startIndex, index);
                index += 1;
                return capturedFrom(index, chunk);
            }
            default: {
                index += 1;
                continue;
            }
        }
    }
    return chokedFrom(index, `Unfinished quoted string.`);
}

