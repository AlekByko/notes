export function makeChordOfKeyboardEvent(e: KeyboardEvent): string {
    const { code, ctrlKey, altKey, shiftKey } = e;
    let mod = '';
    if (ctrlKey) {
        mod += 'CTRL + ';
    }
    if (altKey) {
        mod += 'ALT + ';
    }
    if (shiftKey) {
        mod += 'SHIFT + ';
    }
    mod += code;
    return mod;
}


