import { passedFrom, Read } from './parsed';
export class AfterTakeOr<T, U, Or> {
    constructor(
        private before: Read<T>,
        private now: Read<U>,
        private or: Or,
    ) {
    }
    add<V>(add: (before: T, now: U | Or) => V) {
        const next: Read<V> = (index, text) => {
            const before = this.before(index, text);
            if (before.isJammed) return before;
            const now = this.now(before.index, text);
            if (now.isJammed) {
                const after = add(before.value, this.or);
                return passedFrom(index, before.index, after);
            } else {
                const after = add(before.value, now.value);
                return passedFrom(index, now.index, after);
            }
        };
        return new ReadingSequentially(next);
    }
}
export class AfterTake<T, U> {
    constructor(
        private before: Read<T>,
        private now: Read<U>,
    ) {
    }
    or<Or>(or: Or) {
        return new AfterTakeOr(this.before, this.now, or);
    }
    add<V>(add: (before: T, now: U) => V) {
        const next: Read<V> = (index, text) => {
            const before = this.before(index, text);
            if (before.isJammed) return before;
            const now = this.now(before.index, text);
            if (now.isJammed) return now;
            const after = add(before.value, now.value);
            return passedFrom(index, now.index, after);
        };
        return new ReadingSequentially(next);
    }
}
export class ReadingSequentially<T> {
    constructor(
        public read: Read<T>,
    ) {
    }
    skip(read: Read<unknown>) {
        const next: Read<T> = (index, text) => {
            const before = this.read(index, text);
            if (before.isJammed) return before;
            const now = read(before.index, text);
            if (now.isJammed) return now;
            return passedFrom(index, now.index, before.value);
        };
        return new ReadingSequentially(next);
    }
    take<U>(read: Read<U>) {
        return new AfterTake(this.read, read);
    }

}
export const readSequentially = {
    take<T>(read: Read<T>) {
        return new ReadingSequentially(read);
    },
};
