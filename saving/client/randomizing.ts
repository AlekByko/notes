export function startRandomOver(seed: number) {
    return function rand() {
        seed = prng(seed);
        return seed;
    };
}

function prng(n: number) {
    n = n >>> 0;
    n = (n ^ 61) ^ (n >>> 16);
    n = n + (n << 3);
    n = n ^ (n >>> 4);
    n = n * 0x27d4eb2d;
    n = n ^ (n >>> 15);
    return (n >>> 0) / 0xFFFFFFFF;
}
