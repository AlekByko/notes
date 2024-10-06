import { Captured, capturedFrom, Choked, chokedFrom } from './reading-basics';



export function readIf<Seen, Thened, Elseed, SeenThened, SeenElsed>(
    readSee: (text: string, index: number) => Choked | Captured<Seen>,
    readThen: (text: string, index: number) => Choked | Captured<Thened>,
    haveThen: (seen: Seen, then: Thened) => SeenThened,
    readElse: (text: string, index: number) => Choked | Captured<Elseed>,
    haveElsed: (elsed: Elseed) => SeenElsed,
    text: string, index: number,
): Choked | Captured<SeenThened | SeenElsed> {
    const seen = readSee(text, index);
    if (seen.isBad) {
        const elsed = readElse(text, index);
        if (elsed.isBad) {
            return chokedFrom(elsed.index);
        } else {
            const had = haveElsed(elsed.value);
            return capturedFrom(elsed.index, had);
        }
    } else {
        const thened = readThen(text, seen.index);
        if (thened.isBad) {
            return chokedFrom(thened.index);
        } else {
            const had = haveThen(seen.value, thened.value);
            return capturedFrom(thened.index, had);
        }
    }
}

export function readIfOver<Seen, Thened, Elsed, SeenThened, SeenElsed>(
    readSee: (text: string, index: number) => Choked | Captured<Seen>,
    readThen: (text: string, index: number) => Choked | Captured<Thened>,
    haveThen: (seen: Seen, then: Thened) => SeenThened,
    readElse: (text: string, index: number) => Choked | Captured<Elsed>,
    haveElsed: (elsed: Elsed) => SeenElsed,
) {
    function readIfUnder(text: string, index: number): Choked | Captured<SeenThened | SeenElsed> {
        return readIf(readSee, readThen, haveThen, readElse, haveElsed, text, index);
    }
    readIfUnder.debugName = 'if(' + readSee.toDebugName() + ') ? (' + readThen.toDebugName() + ') : (' + readElse.toDebugName() + ')';
    return readIfUnder;
}
