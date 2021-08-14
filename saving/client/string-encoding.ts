const maxAsciiCharCode = 127;
export function transcode(value: string, delta: number): number[];
export function transcode(value: number[], delta: number): string;
export function transcode(value: string | number[], delta: number): string | number[] {
    if (typeof value === 'string') {
        const result: number[] = [];
        for (let index = 0; index < value.length; index++) {
            const at = value.charCodeAt(index);
            const be = (maxAsciiCharCode + at + delta) % maxAsciiCharCode;
            result.push(be);
        }
        return result;
    } else {
        // value is expected to be an array of char codes
        const result: string[] = [];
        for (let index = 0; index < value.length; index++) {
            const at = value[index];
            const be = (maxAsciiCharCode + at + delta) % maxAsciiCharCode;
            result.push(String.fromCharCode(be));
        }
        return result.join('');
    }
}
