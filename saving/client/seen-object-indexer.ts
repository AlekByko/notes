export function thusSeenObjectsIndexerOf<T>() {
    return class SeenObjectsIndexer {
        private knownThings: Map<T, number> = new Map();
        claimIndex(thing: T): number {
            if (this.knownThings.has(thing)) {
                return this.knownThings.get(thing)!;
            } else {
                const { size } = this.knownThings;
                this.knownThings.set(thing, size);
                return size;
            }
        }
    };
}
