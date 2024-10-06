import { fail } from './core';
import { Captured, Choked, chokedFrom } from './reading-basics';

export class OptionsReader<Result = never> {
    constructor(
        private all = [] as {
            read: (text: string, index: number) => Choked | Captured<unknown>;
        }[],
    ) {
    }

    option<Value>(
        read: (text: string, index: number) => Choked | Captured<Value>,
    ): OptionsReader<Result | Value> {
        this.all.push({ read });
        return this as any;
    }

    build() {
        const { all } = this;
        if (all.length < 1) return fail('No readers');
        function readUnder(text: string, index: number): Choked | Captured<Result> {
            for (let i = 0; i < all.length; i++) {
                const { read } = all[i];
                const newer = read(text, index);
                if (newer.isBad) continue;
                return newer as Captured<Result>;
            }
            return chokedFrom(index);
        };
        readUnder.debugName = 'opt(' + all.map(x => x.read.toDebugName()).join(' - ') + ')'
        return readUnder;
    }
}
